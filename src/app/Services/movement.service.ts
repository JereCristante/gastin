import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../interfaces/CategoryInterface';
import { Observable } from 'rxjs';
import { NewMovement } from '../interfaces/NewMovement';
import { Movement } from '../interfaces/MovementInterface';
import { DateMovs } from '../interfaces/MovementListInterface';
import { environment } from 'src/environments/environment';
import { DateFilter } from '../interfaces/DatesFilterInterface';
import { CategoryTotal } from '../interfaces/CategoryTotalInterface';
import { CategoryTotalUser } from '../interfaces/CategoryTotalUserInterface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  
  url:string=(environment.backendLink+"movements/");
  private token!: string | null; 
  private headers!: HttpHeaders;
  constructor(private http:HttpClient, private tS:TokenService) { 
    this.token=tS.getToken();
    this.headers=new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    })
  }
  public newMovement(user:number,wallet:number,category:number,movementType:number,newMovement:NewMovement,destinationWallet?:number):Observable<Movement>{
    return this.http.post<Movement>(this.url+user+'/'+wallet+'/'+destinationWallet+'/'+category+'/'+movementType+'/movements',newMovement, { headers:this.headers });
  }
  getMovementsByUser(user:number): Observable<DateMovs[]>{
    let direccion = this.url +user+"/movements";
    return this.http.get<DateMovs[]>(direccion,{ headers:this.headers });
  }
  public editMovement(movementId:number,wallet:number,updatedMovement:NewMovement,category?:number,destinationWallet?:number,transfer?:number):Observable<Movement>{
    return this.http.put<Movement>(this.url+movementId+'/'+wallet+'/'+destinationWallet+'/'+transfer+'/'+category+'/movements',updatedMovement,{ headers:this.headers });
  }
  public deleteMovement(movementId:number):Observable<String>{
    return this.http.delete<String>(this.url+'deleteMovement/'+movementId,{ headers:this.headers });
  }
  public getCategoriesTotalReport(userID:number,type:number,dates:DateFilter): Observable<CategoryTotal[]>{
    let direccion = this.url +userID+"/"+type+"/movements";
    return this.http.post<CategoryTotal[]>(direccion,dates,{ headers:this.headers });
  }
  public getCategoriesTotalReportByUpper(userID:number,dates:DateFilter): Observable<CategoryTotalUser[]>{
    let direccion = this.url +userID+"/movements";
    return this.http.post<CategoryTotalUser[]>(direccion,dates,{ headers:this.headers });
  }
}
