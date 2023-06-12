import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/UserInterface';
import {Observable} from 'rxjs';
import { Category } from '../interfaces/CategoryInterface';
import { Wallet } from '../interfaces/WalletInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { Schedule } from '../interfaces/ScheduleInterface';
import { newSchedule } from '../interfaces/newScheduleInterface';
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
  getSchedulesByUser(user:number): Observable<Schedule[]>{
    let direccion = this.url +"schedules/"+user;
    return this.http.get<Schedule[]>(direccion);
  }
  getAccountsByUser(user:number): Observable<Wallet[]>{
    let direccion = this.url +"accounts/"+user+"/accounts";
    return this.http.get<Wallet[]>(direccion);
  }
  getAccountsByUserWithMovements(user:number): Observable<WalletReport[]>{
    let direccion = this.url +"accounts/"+user+"/WithMovements";
    return this.http.get<WalletReport[]>(direccion);
  }
  newCategory(user:number,type:number,category:Category):Observable<Category>{
    let direccion = this.url +"categories/"+user+"/"+type+"/categories";
    return this.http.post<Category>(direccion,category);
  }
  updateCategory(category:Category,type:number):Observable<Category>{
    let direccion = this.url +"categories/"+category.id+"/"+type+"/categories";
    return this.http.put<Category>(direccion,category);
  }
  newAccount(user:number, wallet:Wallet): Observable<Wallet>{
    let direccion = this.url +"accounts/"+user+"/accounts";
    return this.http.post<Wallet>(direccion,wallet);
  }
  updateAccount(id:number,wallet:Wallet): Observable<Wallet>{
    let direccion = this.url +"accounts/"+id+"/accounts";
    return this.http.post<Wallet>(direccion,wallet);
  }
  updateUser(id:number,user:User):Observable<User>{
    let direccion = this.url +"users/"+id;
    return this.http.put<User>(direccion,user);
  }
  deleteSchedule(id:number): Observable<String>{
    let direccion = this.url +"schedules/deleteSchedule/"+id;
    return this.http.delete<String>(direccion);
  }
  newSchedule(schedule:newSchedule):Observable<Schedule>{
    let direccion = this.url +"schedules/new";
    return this.http.post<Schedule>(direccion,schedule);
  }
}
