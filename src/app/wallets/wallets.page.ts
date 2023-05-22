import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Wallet } from '../interfaces/WalletInterface';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {
  wallets: WalletReport[]=[];
  user?:User;
  Capital: number = 0;
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
        this.wallets.forEach(wallet => {
          this.Capital += wallet.account.balance;
        });
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
