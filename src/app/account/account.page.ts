import { Component, OnInit } from '@angular/core';
import { Wallet } from '../interfaces/WalletInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  wallets: WalletReport[]=[];
  user?:User;

  constructor(private uS:UserService) { }

  ngOnInit() {
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.refreshWallets();
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
  refreshWallets() {
    this.uS.getAccountsByUserWithMovements(this.user!.id).subscribe(
      data=> {
        this.wallets=data;
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

}
