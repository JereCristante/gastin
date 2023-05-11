import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../Services/token.service';
import { AuthService } from '../Services/auth.service';
import { LoginUser } from '../interfaces/LoginUser';
import { JwtDto } from '../interfaces/JwtDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
})
export class LoginFormPage implements OnInit {

  validationFormUser!: FormGroup;
  public isLogged = false;
  isLoginFail = false;
  loginUser: LoginUser = {email: '',password: ''};
  errMsj: string ='';

  constructor(public fb:FormBuilder, private router: Router, private tokenService:TokenService, private authService:AuthService) { }

  ngOnInit() {
    if(this.tokenService.getToken()){
      this.isLogged=true;
      this.isLoginFail=false;
    }
    if(this.isLogged){
      this.router.navigate(['/home']);
    }
    this.validationFormUser = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
    })
  }
  LoginUser(value: any){
    console.log(value);
    this.loginUser=new LoginUser(value.email,value.password);

    this.authService.login(this.loginUser).subscribe(
      data=> {
        this.isLogged=true;
        this.isLoginFail=false;
        this.tokenService.setToken(data.token);
        this.tokenService.setEmail(data.email);
        console.log( data + " logueado");
        this.router.navigate(['/home']);
      },
      error => {
        // Manejar el error aquí
        
        if(error.status=401){
          alert('Contraseña o email invalidos');
          this.validationFormUser.reset();
        }
        
      }
    );
  }


}
