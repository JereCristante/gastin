import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/UserInterface';
import {Observable} from 'rxjs';
import { Category } from '../interfaces/CategoryInterface';
import { Wallet } from '../interfaces/WalletInterface';
import { WalletReport } from '../interfaces/WalletReportInterface';
import { Schedule } from '../interfaces/ScheduleInterface';
import { newSchedule } from '../interfaces/newScheduleInterface';
import { environment } from 'src/environments/environment';
import { Report } from '../interfaces/ReportInterface';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string=environment.backendLink;
  private token!: string | null; 
  private headers!: HttpHeaders;
  constructor(private http:HttpClient, private tS:TokenService) { 
    this.token=tS.getToken();
    this.headers=new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    })
  }

  SignUp(user:User): Observable<User>{
    let direccion = this.url + "users/saveUser";
    return this.http.post<User>(direccion,user,{ headers:this.headers });
  }
  getUserInfoByEmail(email:string): Observable<User>{
    let direccion = this.url +"users/email/"+email;
    return this.http.get<User>(direccion,{ headers:this.headers });
  }
  getCategoriesByUser(user:number,type:number): Observable<Category[]>{
    let direccion = this.url +"categories/"+user+"/"+type+"/categories";
    return this.http.get<Category[]>(direccion,{ headers:this.headers });
  }
  getSchedulesByUser(user:number): Observable<Schedule[]>{
    let direccion = this.url +"schedules/"+user;
    return this.http.get<Schedule[]>(direccion,{ headers:this.headers });
  }
  getAccountsByUser(user:number): Observable<Wallet[]>{
    let direccion = this.url +"accounts/"+user+"/accounts";
    return this.http.get<Wallet[]>(direccion,{ headers:this.headers });
  }
  getAccountsByUserWithMovements(user:number): Observable<WalletReport[]>{
    let direccion = this.url +"accounts/"+user+"/WithMovements";
    return this.http.get<WalletReport[]>(direccion,{ headers:this.headers });
  }
  newCategory(user:number,type:number,category:Category):Observable<Category>{
    let direccion = this.url +"categories/"+user+"/"+type+"/categories";
    return this.http.post<Category>(direccion,category,{ headers:this.headers });
  }
  updateCategory(category:Category,type:number):Observable<Category>{
    let direccion = this.url +"categories/"+category.id+"/"+type+"/categories";
    return this.http.put<Category>(direccion,category,{ headers:this.headers });
  }
  newAccount(user:number, wallet:Wallet): Observable<Wallet>{
    let direccion = this.url +"accounts/"+user+"/accounts";
    return this.http.post<Wallet>(direccion,wallet,{ headers:this.headers });
  }
  updateAccount(id:number,wallet:Wallet): Observable<Wallet>{
    let direccion = this.url +"accounts/"+id+"/accounts";
    return this.http.put<Wallet>(direccion,wallet,{ headers:this.headers });
  }
  updateUser(id:number,user:User):Observable<User>{
    let direccion = this.url +"users/"+id;
    return this.http.put<User>(direccion,user,{ headers:this.headers });
  }
  deleteSchedule(id:number): Observable<String>{
    let direccion = this.url +"schedules/deleteSchedule/"+id;
    return this.http.delete<String>(direccion,{ headers:this.headers });
  }
  newSchedule(schedule:newSchedule):Observable<Schedule>{
    let direccion = this.url +"schedules/new";
    return this.http.post<Schedule>(direccion,schedule,{ headers:this.headers });
  }
  newReport(newreport:Report, userid:number):Observable<Report>{
    let direccion = this.url +"reports/"+userid;
    return this.http.post<Report>(direccion,newreport,{ headers:this.headers });
  }
}
