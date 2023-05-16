import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/UserInterface';
import {Observable} from 'rxjs';
import { Category } from '../interfaces/CategoryInterface';
import { Wallet } from '../interfaces/WalletInterface';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string="http://localhost:8080/api/";
  constructor(private http:HttpClient) { }

  SignUp(user:User): Observable<User>{
    let direccion = this.url + "users/saveUser";
    return this.http.post<User>(direccion,user);
  }
  getUserInfoByEmail(email:string): Observable<User>{
    let direccion = this.url +"users/email/"+email;
    return this.http.get<User>(direccion);
  }
  getCategoriesByUser(user:number,type:number): Observable<Category[]>{
    let direccion = this.url +"categories/"+user+"/"+type+"/categories";
    return this.http.get<Category[]>(direccion);
  }
  getAccountsByUser(user:number): Observable<Wallet[]>{
    let direccion = this.url +"accounts/"+user+"/accounts";
    return this.http.get<Wallet[]>(direccion);
  }
}
