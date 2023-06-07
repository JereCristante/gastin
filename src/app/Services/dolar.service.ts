import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dolar } from '../interfaces/DolarInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DolarService {
  url:string="https://api.bluelytics.com.ar/v2/latest";
  constructor(private http:HttpClient) { }

  getDolar(): Observable<Dolar>{
    let direccion = this.url ;
    return this.http.get<Dolar>(direccion);
  }

}
