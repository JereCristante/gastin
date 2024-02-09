import { Injectable } from '@angular/core';

const TOKEN_KEY='AuthToken';
const EMAIL_KEY='AuthEmail';
const ROLE_KEY='AuthRole';
const ID_KEY='AuthId';

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
  public setRole(role:string):void{
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.setItem(ROLE_KEY,role);
  }
  public setId(id:number):void{
    window.sessionStorage.removeItem(ID_KEY);
    window.sessionStorage.setItem(ID_KEY,id.toString());
  }
  public getToken():string{
    return sessionStorage.getItem(TOKEN_KEY)!;
  }
  public getEmail():string{
    return sessionStorage.getItem(EMAIL_KEY)!;
  }
  public getRole():string{
    return sessionStorage.getItem(ROLE_KEY)!;
  }
  public getId():number{
    return parseInt(sessionStorage.getItem(ID_KEY)!);
  }
  public logOut(): void{
    window.sessionStorage.clear();
  }

}
