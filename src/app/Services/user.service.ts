import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/UserInterface';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string="http://localhost:8080/api/users/";
  constructor(private http:HttpClient) { }

  SignUp(user:User): Observable<User>{
    let direccion = this.url + "saveUser"
    return this.http.post<User>(direccion,user);
  }
}
