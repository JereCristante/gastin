import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DolarService } from '../Services/dolar.service';
import { coin } from '../interfaces/DolarInterface';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoryTotal } from '../interfaces/CategoryTotalInterface';
import { MovementService } from '../Services/movement.service';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { CategoryTotalUser } from '../interfaces/CategoryTotalUserInterface';
import { TokenService } from '../Services/token.service';
import { MetricsService } from '../Services/metrics.service';
import { TransactionsByDay } from '../interfaces/TransactionsByDayInterface';
import { PendingReport } from '../interfaces/PendingReport';
import { NewUsersByMonth } from '../interfaces/NewUsersByMonth';
import { ChartDataset } from 'chart.js';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  dolarBlue!:coin;
  dolarOficial!:coin;
  lastUpdate!:Date;
  errorMsg: string="Error";
  alertError: boolean=false;
  validatorDates!: FormGroup;
  today = new Date();
  userTimezoneOffset = this.today.getTimezoneOffset();
  utcDate = new Date(this.today.getTime() - (this.userTimezoneOffset * 60 * 1000));
  utcDateLast = new Date(this.today.getTime() - (1000 * 60 * 60 * 24 * 31) - (this.userTimezoneOffset * 60 * 1000));
  spentCategoriesTotal!: CategoryTotal[];
  incomeCategoriesTotal!: CategoryTotal[]; 
  spentTotal!: number;
  incomeTotal!: number;
  user!: User;
  public spentPieChartData!: ChartData<'pie', number[], string | string[]>;
  public incPieChartData!: ChartData<'pie', number[], string | string[]>;
  public barChartData!: ChartData<'bar'>;
  public barChartTransactionsData!: ChartData<'bar'>;
  userSpentCategoriesTotal!: CategoryTotalUser[];
  public spentPieChartDataUsers: ChartData<'pie', number[], string | string[]>[]= [];
  pendingReports: PendingReport[]=[];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: { color: '#4CA49C' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#4CA49C' },
      }
    },
  };
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartUsersLabels: String[] = [];
  public lineChartUsersData: ChartDataset[] = [
    { data: [], label: 'Usuarios Nuevos Registrados',borderColor: '#4CA49C'},
  ];
  public lineChartTransactionsLabels: String[] = [];
  public lineChartTransactionsData: ChartDataset[] = [
    { data: [], label: 'Transacciones Realizadas',borderColor: '#4CA49C'},
  ];
  constructor(private dS:DolarService, private fb:FormBuilder, private modalController: ModalController, private Ms:MovementService, private uS:UserService, public tS:TokenService,private metS:MetricsService) {
    this.validatorDates = this.fb.group({
      from: new FormControl(this.utcDateLast.toISOString(), Validators.compose([Validators.required])),
      to: new FormControl(this.utcDate.toISOString(), Validators.compose([Validators.required]))
    });
    this.dS.getDolar().subscribe(
      data=> {
        this.dolarBlue=data.blue;
        this.dolarOficial=data.oficial;
        this.lastUpdate=data.last_update;
      },
      error => {
            this.alertErrorOpen(true,error.error);
      }
    );
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.refreshReports();
      },
      error => {
        // Manejar el error aquí
          //if(error.status!=200){
            this.alertErrorOpen(true);
          //}
      }
    );
    
   }

  ngOnInit() {
    
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.refreshReports();
      event.target.complete();
    }, 4000);
  
  };
  refreshReports(){
    this.Ms.getCategoriesTotalReport(this.user!.id!,1,{dateFrom:this.validatorDates.value.from,dateTo:this.validatorDates.value.to}).subscribe(
      data=> {
        this.spentTotal=0;
        this.spentCategoriesTotal=data;
        this.spentCategoriesTotal.map(category => this.spentTotal+=category.total);
        this.spentPieChartData = {
          labels: 
             this.spentCategoriesTotal.map(category => category.description)
          ,
          datasets: [ 
            {data:this.spentCategoriesTotal.map(category => category.total)}
           ]
        };
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
        //}
        
      }
    );
    this.Ms.getCategoriesTotalReport(this.user!.id!,2,{dateFrom:this.validatorDates.value.from,dateTo:this.validatorDates.value.to}).subscribe(
      data=> {
        this.incomeTotal=0;
        this.incomeCategoriesTotal=data;
        this.incomeCategoriesTotal.map(category => this.incomeTotal+=category.total);
        this.incPieChartData = {
          labels: 
             this.incomeCategoriesTotal.map(category => category.description)
          ,
          datasets: [ 
            {data:this.incomeCategoriesTotal.map(category => category.total)}
           ]
        };
        this.barChartData= {
          labels: [ '' ],
          datasets: [
            { data: [ this.incomeTotal ], label: 'Ingresos', backgroundColor: '#4CA49C'},
            { data: [ this.spentTotal*-1 ], label: 'Gastos' , backgroundColor: '#D11F1F'}
          ]
        };
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
        //}
        
      }
    );
    this.Ms.getCategoriesTotalReportByUpper(this.user!.id!,{dateFrom:this.validatorDates.value.from,dateTo:this.validatorDates.value.to}).subscribe(
      data=> {
        this.spentPieChartDataUsers = [];
        this.userSpentCategoriesTotal=data;
        data.forEach(user => {
          let userPieChartData: ChartData<'pie', number[], string | string[]> = {
            labels: 
            user.categories.map(category => category.description)
            ,
            datasets: [ 
              {data:user.categories.map(category => category.total)}
             ]
          };
          this.spentPieChartDataUsers.push(userPieChartData);
        });
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
        //}
        
      }
    );
     if (this.tS.getRole()=="ADMIN"){
      this.metS.getTransactionsByDay().subscribe({
        next:(response:TransactionsByDay[])=>{
          this.lineChartTransactionsLabels = response.map(item => item.date);
          this.lineChartTransactionsData[0].data = response.map(item => item.amount);
        }
      });
      this.metS.getNewUsersByMonth().subscribe({
        next:(response:NewUsersByMonth[])=>{
          this.lineChartUsersLabels = response.map(item => item.date);
          this.lineChartUsersData[0].data = response.map(item => item.amount);
        }
      });
      this.metS.getReportsByUser().subscribe({
        next:(response:PendingReport[])=>{
          this.pendingReports=response;
        }
      });
     }
  }
  
  saveDates(){
    this.refreshReports();
    this.modalController.dismiss();
  }
  alertErrorOpen(bool :boolean,msg?:string){
    if(msg){
      this.errorMsg=msg;
    }else{
      this.errorMsg="Error";
    }
    this.alertError=bool;
  }
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    
    scales: {
      x: {},
      y: {
        min: 0
      }
    }
  };
  public barChartType: ChartType = 'bar';
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
      //datalabels: {
       // 'varios','varios'
      //},
    }
  };
  public pieChartType: ChartType = 'pie';
  // events
  //public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
 // }

}

