import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../interfaces/UserInterface';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../Services/token.service';
import { AuthService } from '../Services/auth.service';
import { NewUser } from '../interfaces/newUser';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild('modalTermsAndCond') modalTermsAndCond: IonModal | undefined;
  validatorFormUser!: FormGroup;
  passwordsMatching = false;
  newUser: NewUser = {alias: '', email: '',password: ''};
  errorMsg: string="Error";
  alertError: boolean=false;

  constructor(public fb:FormBuilder, private uS:UserService, private router: Router, private tokenService:TokenService, private authService:AuthService) { 
    this.newUser.email='';
    this.newUser.password='';
    this.newUser.alias='';
    this.validatorFormUser = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      alias: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)])),
      passwordRep: new FormControl('', Validators.compose([Validators.required])),
      terms: new FormControl('false', Validators.compose([Validators.required, Validators.requiredTrue]))
    },
    {
      validator: this.ConfirmedValidator('password', 'passwordRep')
    }
    )
  }

  ngOnInit() {
    //if(this.tokenService.getToken()){
      //this.isLogged=true;
      //this.isLoginFail=false;
    //}
    // this.validatorFormUser = this.fb.group({
    //   email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    //   alias: new FormControl('', Validators.compose([Validators.required])),
    //   password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)])),
    //   passwordRep: new FormControl('', Validators.compose([Validators.required]))
    // }//,
    //{
      //validator: this.ConfirmedValidator('password', 'passwordRep')
    //}
    //)
  }
alertErrorOpen(bool :boolean,msg?:string){
    if(msg){
      this.errorMsg=msg;
    }else{
      this.errorMsg="Error";
    }
    this.alertError=bool;
  }
  SignUpUser(value:any){
    this.newUser.email=value.email;
    this.newUser.alias=value.alias;
    this.newUser.password=value.password;
    this.authService.newUser(this.newUser).subscribe(
      data=> {
        this.router.navigate(['/login-form']);
      },
      error => {
        // Manejar el error aquí
        if(error.status==201 || error.error.text=="Usuario Creado con exito"){
          this.router.navigate(['/login-form']);
        }
        if(error.status==400 || error.error=="Ese email ya tiene una cuenta creada"){
          this.alertErrorOpen(true,error.error);
        }
      }
    );
    
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  openTermsAndCond(){
    this.modalTermsAndCond?.present();
  }
}
