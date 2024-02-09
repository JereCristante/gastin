import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  home!: HTMLElement | null;
  wallets!: HTMLElement | null;
  reports!: HTMLElement | null;
  settings!: HTMLElement | null;
  account!: HTMLElement | null;

  constructor() {}

  ngAfterViewInit() {
    this.home = document.getElementById('home');
    this.wallets = document.getElementById('wallets');
    this.reports = document.getElementById('reports');
    this.settings = document.getElementById('settings');
    this.account = document.getElementById('account');
  }

  selected(tab:string){
    this.home!.style.color='#EFEBDD';
    this.wallets!.style.color='#EFEBDD';
    this.reports!.style.color='#EFEBDD';
    this.settings!.style.color='#EFEBDD';
    this.account!.style.color='#EFEBDD';
    switch (tab) {
      case 'home':
        this.home!.style.color='#4CA49C';
        break;
      case 'wallets':
        this.wallets!.style.color='#4CA49C';
        break;  
      case 'reports':
        this.reports!.style.color='#4CA49C';
        break;
      case 'settings':
        this.settings!.style.color='#4CA49C';
        break;
      case 'account':
        this.account!.style.color='#4CA49C';
        break;
      // Agrega casos para otros tabs si es necesario
    }
  }

}
