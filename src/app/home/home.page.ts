import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Movement } from '../interfaces/MovementInterface';
import { DateMovs } from '../interfaces/MovementListInterface';
import { Category } from '../interfaces/CategoryInterface';
import { Wallet } from '../interfaces/WalletInterface';
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
  constructor(private http:HttpClient){
  }
  ngOnInit() {
    this.generateItems();
    //this.getMovements().subscribe(res=>{this.movements = res;});
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Gasto ${count + i}`);
    }
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
  


  cancel() {
  // this.modal.dismiss(null, 'cancel');
  }

  confirm() {
   //this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    //const ev = event as CustomEvent<OverlayEventDetail<string>>;
    //if (ev.detail.role === 'confirm') {
    //  this.message = `Hello, ${ev.detail.data}!`;
    //}
  }
  //getMovements(){
  //  return this.http.get("").pipe(map((res:any)=> {return res.data;}))
  //}
}
