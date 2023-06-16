import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DolarService } from '../Services/dolar.service';
import { coin } from '../interfaces/DolarInterface';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
  constructor(private dS:DolarService, private fb:FormBuilder, private modalController: ModalController) {
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
   }

  ngOnInit() {
    
  }
  saveDates(){
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
        min: 1000
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [ 'VS' ],
    datasets: [
      { data: [ 6000 ], label: 'Ingresos', backgroundColor: '#4CA49C'},
      { data: [ 4000 ], label: 'Gastos' , backgroundColor: '#D11F1F'}
    ]
  };
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
  public spentPieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'Varios' ], [ 'Comida' ], 'Transporte' ],
    datasets: [ {
      data: [ 3000, 500, 100]
    } ]
  };
  public incPieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'Varios' ], [ 'Sueldo' ], 'Inversiones' ],
    datasets: [ {
      data: [ 500, 5000, 1000]
    } ]
  };
  public pieChartType: ChartType = 'pie';
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

}

