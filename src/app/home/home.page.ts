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
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //@ViewChild(IonModal) modal1: IonModal;
  items = ['Gasto 1'];
  dates: DateMovs[]=[];
  categories: Category[]=[];
  wallets: Wallet[]=[];
  destwallets: Wallet[]=[];
  user?:User;
  today = new Date();
  userTimezoneOffset = this.today.getTimezoneOffset(); // Obtén el desplazamiento de la zona horaria del usuario en minutos
  utcDate = new Date(this.today.getTime() - (this.userTimezoneOffset * 60 * 1000));
  validatorMovement!: FormGroup;
  MovementType: number = 1;
  constructor(public fb:FormBuilder, private uS:UserService, private mS:MovementService, private modalController: ModalController){
    
    this.validatorMovement = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required])),
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
      },
      error => {
        // Manejar el error aquí
          //if(error.status!=200){
            alert(error.error);
            console.log(error)
          //}
      }
    );

    
    
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Gasto ${count + i}`);
    }
  }
  closeModal() {
    this.refreshWallets();
    this.refreshCategories();
    this.validatorMovement.reset();
    this.refreshMovements();
    this.modalController.dismiss();
  }
  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
  refreshCategories(){
    this.uS.getCategoriesByUser(this.user!.id,this.MovementType).subscribe(
      data=> {
        this.categories=data;
        if(this.categories[0].id){
          this.validatorMovement.patchValue({category:this.categories[0].id});
        }
        
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
  }
  refreshWallets(){
    this.uS.getAccountsByUser(this.user!.id).subscribe(
      data=> {
        this.wallets=data;
        this.destwallets=data;
        this.validatorMovement.patchValue({wallet:this.wallets[0].id});
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
  }
  refreshMovements(){
    this.mS.getMovementsByUser(this.user!.id).subscribe(
      data=> {
        this.dates=data;
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
          console.log(error)
        //}
        
      }
    );
  }
  confirmMovement(value:any){
    console.log(value);
    if(value.amount <0.01){
      alert('El monto debe ser minimo 1 centavo');
        return;
    }
    if(this.MovementType===1 || this.MovementType===3){
      const Selectedwallet = this.wallets.find((wallet) => wallet.id === value.wallet);
      if(value.amount > Selectedwallet!.balance){
        alert('El monto de la operacion es mayor al saldo de la cuenta seleccionada');
        return;
      }
      if(value.wallet === value.destinationWallet){
        alert('La cuenta de origen no puede ser la misma que la de destino');
        return;
      }
    }

    let movimiento = new NewMovement(value.description,value.amount,value.date,true);
    //if(value.destinationWallet==''){
      //value.destinationWallet=0;
    //}
    this.mS.newMovement(this.user!.id,value.wallet,value.category,this.MovementType, movimiento,value.destinationWallet).subscribe(
      data=> {
        this.validatorMovement.reset();
        this.closeModal();
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          alert(error.error);
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
