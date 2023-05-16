import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/CategoryInterface';
import { Observable } from 'rxjs';
import { NewMovement } from '../interfaces/NewMovement';
import { Movement } from '../interfaces/MovementInterface';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  url:string="http://localhost:8080/api/movements/";
  constructor(private http:HttpClient) { }
  public newMovement(user:number,wallet:number,category:number,movementType:number,newMovement:NewMovement,destinationWallet?:number):Observable<Movement>{
    return this.http.post<Movement>(this.url+user+'/'+wallet+'/'+destinationWallet+'/'+category+'/'+movementType+'/movements',newMovement);
  }
  
}
