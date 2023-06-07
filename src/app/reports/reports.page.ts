import { Component, OnInit } from '@angular/core';
import { DolarService } from '../Services/dolar.service';
import { coin } from '../interfaces/DolarInterface';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  dolarBlue!:coin;
  dolarOficial!:coin;
  lastUpdate!:Date;
  constructor(private dS:DolarService) {
    this.dS.getDolar().subscribe(
      data=> {
        this.dolarBlue=data.blue;
        this.dolarOficial=data.oficial;
        this.lastUpdate=data.last_update;
      },
      error => {
            alert(error.error);
            console.log(error);
      }
    );
   }

  ngOnInit() {
    
  }

}
