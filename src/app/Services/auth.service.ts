import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewUser } from '../interfaces/newUser';
import { LoginUser } from '../interfaces/LoginUser';
import { Observable } from 'rxjs';
import { JwtDto } from '../interfaces/JwtDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL='http://localhost:8080/api/auth/'
  constructor(private httpClient: HttpClient) { }

  public newUser(NewUser:NewUser):Observable<any>{
    return this.httpClient.post<any>(this.authURL+'signup',NewUser);
  }
  public login(LoginUser:LoginUser):Observable<JwtDto>{
    return this.httpClient.post<JwtDto>(this.authURL+'login',LoginUser);
  }
}
