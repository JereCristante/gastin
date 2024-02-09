import { Component, OnInit } from '@angular/core';
import { Wallet } from '../interfaces/WalletInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { UserService } from '../Services/user.service';
import { User } from '../interfaces/UserInterface';
import { TokenService } from '../Services/token.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user?:User;
  alias?: string;
  idUpperUser: number=0;
  screens: string[]=["Principal (1)","Cuentas (2)","Reportes (3)","Categorias (4)","Usuario (5)"];
  types: string[]=["Error","Sugerencia","Otro"];
  userTimezoneOffset = new Date().getTimezoneOffset(); // Obtén el desplazamiento de la zona horaria del usuario en minutos
  utcDate = new Date(new Date().getTime() - (this.userTimezoneOffset * 60 * 1000));
  validatorReport!: FormGroup;
  alertError= false;
  alertSuccess= false;
  errorMsg="Error"
  constructor(private uS:UserService, private tS:TokenService, private router:Router, private fb:FormBuilder) { 
    this.validatorReport= this.fb.group({
      observation: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(150)])),
      type: new FormControl('', Validators.compose([Validators.required])),
      screen: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl(this.utcDate.toISOString(), Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
    this.refreshUser();
  }
  alertErrorOpen(bool :boolean,msg?:string){
    if(msg){
      this.errorMsg=msg;
    }else{
      this.errorMsg="Error";
    }
    this.alertError=bool;
  }
  alertSuccessOpen(bool :boolean){
    this.alertSuccess=bool;
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
            this.alertErrorOpen(true,error.error);
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
            this.alertErrorOpen(true,error.error);
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
            this.alertErrorOpen(true,error.error);
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
  confirmReport(value: any){
    let newReport = {observation:value.observation,type:value.type,screen:value.screen,state:"Reclamado",date:value.date,user:this.user!.id!.toString()}
    this.uS.newReport(newReport,this.user!.id!).subscribe(
      data=> {
        this.alertSuccessOpen(true);
        this.validatorReport.reset();
      },
      error => {
        
        if(error.status=401){
          this.alertErrorOpen(true,'Error al enviar');
        }
        
      }
    );
  }
}
