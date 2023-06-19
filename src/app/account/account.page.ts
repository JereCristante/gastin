import { Component, OnInit } from '@angular/core';
import { Wallet } from '../interfaces/WalletInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { TokenService } from '../Services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user?:User;
  alias?: string;
  idUpperUser: number=0;
  constructor(private uS:UserService, private tS:TokenService, private router:Router) { 
  }
  ngOnInit() {
    this.refreshUser();
  }
  refreshUser(){
    this.uS.getUserInfoByEmail(sessionStorage.getItem('AuthEmail')!).subscribe(
      data=> {
        this.user=data;
        this.alias=this.user.alias!;
        this.idUpperUser=this.user.idUpperUser!;
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
  updateAlias(){
    let user: User = {alias:this.alias}
    this.uS.updateUser(this.user?.id!,user).subscribe(
      data=> {
        this.refreshUser();
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
  updateIdUser(){
    let user: User = {idUpperUser:this.idUpperUser}
    this.uS.updateUser(this.user?.id!,user).subscribe(
      data=> {
        this.refreshUser();
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
  logOut(){
    this.tS.logOut();
    this.router.navigate(['/login-form']);
  }
  
  openEmailApp() {
    const email = 'gastinapp@gmail.com';
    const subject = 'Soporte al Usuario';
    //const body = 'Contenido del correo';
    const emailAppUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    //const emailAppUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailAppUrl, '_system');
  }
}
