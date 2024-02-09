import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { TransactionsByDay } from '../interfaces/TransactionsByDayInterface';
import { Observable } from 'rxjs';
import { PendingReport } from '../interfaces/PendingReport';
import { NewUsersByMonth } from '../interfaces/NewUsersByMonth';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  url:string=(environment.backendLink);
  private token!: string | null; 
  private headers!: HttpHeaders;
  constructor(private http:HttpClient, private tS:TokenService) { 
    this.token=tS.getToken();
    this.headers=new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    })
  }

  getTransactionsByDay(): Observable<TransactionsByDay[]>{
    let direccion = this.url +"metrics/transactions";
    return this.http.get<TransactionsByDay[]>(direccion,{ headers:this.headers });
  }
  getNewUsersByMonth(): Observable<NewUsersByMonth[]>{
    let direccion = this.url +"metrics/new-users";
    return this.http.get<NewUsersByMonth[]>(direccion,{ headers:this.headers });
  }
  getReportsByUser(): Observable<PendingReport[]>{
    let direccion = this.url +"reports/list";
    return this.http.get<PendingReport[]>(direccion,{ headers:this.headers });
  }
}
