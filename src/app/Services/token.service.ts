import { Injectable } from '@angular/core';

const TOKEN_KEY='AuthToken';
const EMAIL_KEY='AuthEmail';



@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public setToken(token:string):void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
  }
  public setEmail(email:string):void{
    window.sessionStorage.removeItem(EMAIL_KEY);
    window.sessionStorage.setItem(EMAIL_KEY,email);
  }
  public getToken():string{
    return sessionStorage.getItem(TOKEN_KEY)!;
  }
  public getEmail():string{
    return sessionStorage.getItem(EMAIL_KEY)!;
  }
  public logOut(): void{
    window.sessionStorage.clear();
  }

}
