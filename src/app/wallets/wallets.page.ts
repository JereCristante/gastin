import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Wallet } from '../interfaces/WalletInterface';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {
  wallets:Wallet[]=[];
  constructor(private http:HttpClient){
  }

  ngOnInit() {
    this.getWallets().subscribe(res=>{this.wallets = res;});
  }
  getWallets(){
    return this.http.get("").pipe(map((res:any)=> {return res.data;}))
  }
}
