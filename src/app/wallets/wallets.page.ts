import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Wallet } from '../interfaces/WalletInterface';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {
  @ViewChild('modalEditWallet') modalEditWallet: IonModal | undefined;
  wallets: WalletReport[]=[];
  user?:User;
  Capital: number = 0;
  validatorWallet!: FormGroup;
  validatorEditWallet!: FormGroup;
  editableWallet!:WalletReport;
  errorMsg: string="Error";
  alertError: boolean=false;
  constructor(public fb:FormBuilder,private uS:UserService, private modalController: ModalController) { 
    this.validatorWallet = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)])),
      balance: new FormControl('', Validators.compose([Validators.required]))
    });
    this.validatorEditWallet = this.fb.group({
      description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(18)])),
      balance: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit() {
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.refreshWallets();
      },
      error => {
        // Manejar el error aquí
          //if(error.status!=200){
            this.alertErrorOpen(true,error.error);
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
  refreshWallets() {
    this.uS.getAccountsByUserWithMovements(this.user!.id!).subscribe(
      data=> {
        this.wallets=data;
        this.Capital=0;
        this.wallets.forEach(wallet => {
          this.Capital += wallet.account.balance;
        });
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true,error.error);
        //}
        
      }
    );
  }
  cancel() {
    this.closeModal();
  }
  closeModal() {
    this.refreshWallets();
    this.validatorWallet.reset();
    this.validatorEditWallet.reset();
    this.modalController.dismiss();
  }
  confirmWallet(value:any){
    if(value.balance <0.01){
      this.alertErrorOpen(true,'El monto debe ser minimo 1 centavo');
        return;
    }

    let wallet: Wallet ={description: value.description, balance: value.balance, active:true};

    this.uS.newAccount(this.user!.id!,wallet).subscribe(
      data=> {
        this.validatorWallet.reset();
        this.closeModal();
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true,error.error);
        //}
        
      }
    );
  }
  openEditWallet(wallet:WalletReport){
    this.editableWallet=wallet;
    this.validatorEditWallet.patchValue({description:wallet.account.description});
    this.validatorEditWallet.patchValue({balance:wallet.account.balance});
    this.modalEditWallet?.present();
  }
  editWallet(value:any){
    if(value.balance <0.01){
      this.alertErrorOpen(true,'El monto debe ser minimo 1 centavo');
        return;
    }

    let wallet: Wallet ={description: value.description, balance: value.balance, active:true};

    this.uS.newAccount(this.editableWallet.account.id!,wallet).subscribe(
      data=> {
        this.validatorWallet.reset();
        this.closeModal();
      },
      error => {
        // Manejar el error aquí
        //if(error.status!=302){
          this.alertErrorOpen(true,error.error);
        //}
        
      }
    );
  }
}
