import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Movement } from '../interfaces/MovementInterface';
import { DateMovs } from '../interfaces/MovementListInterface';
import { Category } from '../interfaces/CategoryInterface';
import { Wallet } from '../interfaces/WalletInterface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { MovementService } from '../Services/movement.service';
import { User } from '../interfaces/UserInterface';
import { AuthService } from '../Services/auth.service';
import { NewMovement } from '../interfaces/NewMovement';
import { ModalController } from '@ionic/angular';
import { Schedule } from '../interfaces/ScheduleInterface';
import { newSchedule } from '../interfaces/newScheduleInterface';
import { Reps } from '../interfaces/RepsInterface';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('modalEditMovement') modalEditCategory: IonModal | undefined;
  items = ['Gasto 1'];
  dates: DateMovs[]=[];
  categories: Category[]=[];
  wallets: Wallet[]=[];
  destwallets: Wallet[]=[];
  user?:User;
  activeSchedules: Schedule[]=[];
  today = new Date();
  userTimezoneOffset = this.today.getTimezoneOffset(); // Obtén el desplazamiento de la zona horaria del usuario en minutos
  utcDate = new Date(this.today.getTime() - (this.userTimezoneOffset * 60 * 1000));
  validatorMovement!: FormGroup;
  validatorEditMovement!: FormGroup;
  MovementType: number = 1;
  editableMovement!: Movement;
  confirmDelete= '';
  confirmSchedule='';
  repetitions: Reps[] = [{times:3,text:"3 veces"}, {times:6,text:"6 veces"},{times:9,text:"9 veces"},{times:12,text:"12 veces"},{times:18,text:"18 veces"},{times:24,text:"24 veces"},{times:36,text:"36 veces"}]; 
  scheduleAlertHeader="Desea eliminar la programación? Esto no eliminará los movimientos ya realizados";
  alertError= false;
  errorMsg="Error"
  constructor(public fb:FormBuilder, private uS:UserService, private mS:MovementService, private modalController: ModalController){
    
    this.validatorMovement = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)])),
      amount: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl(this.utcDate.toISOString(), Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      wallet: new FormControl('', Validators.compose([Validators.required])),
      destinationWallet: new FormControl(0, Validators.compose([Validators.required])),
      reps: new FormControl(0)
    });
    this.validatorEditMovement = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)])),
      amount: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl(this.utcDate.toISOString(), Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      wallet: new FormControl('', Validators.compose([Validators.required])),
      destinationWallet: new FormControl(0, Validators.compose([Validators.required]))
    });
  }
  ngOnInit() {
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.refreshCategories();
        this.refreshWallets();
        this.refreshMovements();
        this.refreshSchedules();
      },
      error => {
        // Manejar el error aquí
          //if(error.status!=200){
            this.alertErrorOpen(true);
          //}
      }
    );
  }
  alertErrorOpen(bool :boolean,msg?:string){
    if(msg){
      this.errorMsg=msg;
    }else{
      this.errorMsg="Error";
    }
    this.alertError=bool;
  }
  closeModal() {
    this.refreshWallets();
    this.refreshCategories();
    this.validatorMovement.reset();
    this.refreshMovements();
    this.modalController.dismiss();
  }
  onIonInfinite(ev: any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.refreshMovements();
      event.target.complete();
    }, 4000);
  
  };
  refreshCategories(){
    this.uS.getCategoriesByUser(this.user!.id!,this.MovementType).subscribe(
      data=> {
        this.categories=data;
        if(this.categories !=undefined){
          this.validatorMovement.patchValue({category:this.categories[0].id});
        }
        
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
          console.log(error)
        //}
        
      }
    );
  }
  refreshSchedules(){
    this.uS.getSchedulesByUser(this.user!.id!).subscribe(
      data=> {
        this.activeSchedules=[];
        this.activeSchedules=data;     
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
        //}
        
      }
    );
  }
  refreshWallets(){
    this.uS.getAccountsByUser(this.user!.id!).subscribe(
      data=> {
        this.wallets=data;
        this.destwallets=data;
        this.validatorMovement.patchValue({wallet:this.wallets[0].id});
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
          console.log(error)
        //}
        
      }
    );
  }
  refreshMovements(){
    this.mS.getMovementsByUser(this.user!.id!).subscribe(
      data=> {
        this.dates=data;
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
          console.log(error)
        //}
        
      }
    );
  }
  confirmMovement(value:any){
    console.log(value);
    if(value.amount <0.01){
      this.alertErrorOpen(true,'El monto debe ser minimo 1 centavo');
        return;
    }
    if(this.MovementType===1 || this.MovementType===3){
      const Selectedwallet = this.wallets.find((wallet) => wallet.id === value.wallet);
      if(value.amount > Selectedwallet!.balance){
        this.alertErrorOpen(true,'El monto de la operacion es mayor al saldo de la cuenta seleccionada');
        return;
      }
      if(value.wallet === value.destinationWallet){
        this.alertErrorOpen(true,'La cuenta de origen no puede ser la misma que la de destino');
        return;
      }
    }

    let movimiento = new NewMovement(value.description,value.amount,value.date,true);
    console.log(value.date);
    console.log(movimiento);
    //if(value.destinationWallet==''){
      //value.destinationWallet=0;
    //}
    this.mS.newMovement(this.user!.id!,value.wallet,value.category,this.MovementType, movimiento,value.destinationWallet).subscribe(
      data=> {
        if(value.reps!=0){
          let day = new Date((value.date)).getUTCDate();
          let schedule = new newSchedule(day,value.reps,1,true,data.id);
          console.log(schedule);
          this.uS.newSchedule(schedule).subscribe(
            data=> {
              this.refreshSchedules();
              this.validatorMovement.reset();
              this.closeModal();
            },
            error => {
               //Manejar el error aquí
              if(error.status!=200){
                this.alertErrorOpen(true);
                console.log(error)
              }
              
            }
          );
        }
        this.validatorMovement.reset();
        this.closeModal();

      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true);
          console.log(error)
        //}
        
      }
    );
  }
  segmentChanged(event : any) {
    if(event.detail.value == "Gasto"){
      this.MovementType=1;
      this.refreshCategories();
      this.validatorMovement.patchValue({destinationWallet:0});
    }
    if(event.detail.value == "Ingreso"){
      this.MovementType=2;
      this.refreshCategories();
      this.validatorMovement.patchValue({destinationWallet:0});
    }
    if(event.detail.value == "Movimiento"){
      this.MovementType=3;
      this.validatorMovement.patchValue({category:0});
      //this.validatorMovement.patchValue({destinationWallet:''});
    }
  }
  editMovement(movement:Movement){
    console.log(movement);
    this.editableMovement=movement;
    this.validatorEditMovement.patchValue({description:movement.description});
    if(movement.movementType==1){
    this.validatorEditMovement.patchValue({amount:(movement.amount)*-1});
    }else{
      this.validatorEditMovement.patchValue({amount:movement.amount});
    }
    this.validatorEditMovement.patchValue({date:new Date(movement.date!).toISOString()});
    this.validatorEditMovement.patchValue({wallet:movement.account});
    if(movement.movementType!=3){
      this.validatorEditMovement.patchValue({category:movement.category});
    }
    this.modalEditCategory?.present();
    
  }
  confirmEditMovement(value:any){
    console.log(value);
    let updatedMovement = new NewMovement(value.description,value.amount,value.date,true);
    if(value.category==undefined){
      value.category=0;
    }
    if(value.destinationWallet==undefined){
      value.destinationWallet=0;
    }
    if(this.editableMovement.transfer==undefined){
      this.editableMovement.transfer=0;
    }
    this.mS.editMovement(this.editableMovement.id,value.wallet,updatedMovement,value.category,value.destinationWallet,this.editableMovement.transfer).subscribe(
      data=> {
        this.validatorEditMovement.reset();
        this.closeModal();
      },
      error => {
         //Manejar el error aquí
        if(error.status!=302){
          this.alertErrorOpen(true);
          console.log(error)
        }
        
      }
    );
  }
  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.confirmDelete = 'no';
      },
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      handler: () => {
        this.confirmDelete = 'yes';
      },
    },
  ];
  deleteMovement(movement:number){
    if(this.confirmDelete=='yes'){
    this.mS.deleteMovement(movement).subscribe(
      data=> {
        this.closeModal();
      },
      error => {
         //Manejar el error aquí
        if(error.status!=200){
          this.alertErrorOpen(true);
        }else{
          this.closeModal();
        }
      }
    )};
  }
  deleteSchedule(schedule:number){
    this.uS.deleteSchedule(schedule).subscribe(
      data=> {
        this.refreshSchedules();
      },
      error => {
         //Manejar el error aquí
        if(error.status!=200){
          this.alertErrorOpen(true);
        }else{
          this.refreshSchedules();
        }
        
      }
    );
  }
  onSelectionChange(event: any) {
    const selectedWallet = event.detail.value;
    this.destwallets = this.wallets.filter((wallet) => wallet.id !== selectedWallet);

  }
  cancel() {
    this.closeModal();
  }

  confirm() {
    this.modalController.dismiss();
  }

}
