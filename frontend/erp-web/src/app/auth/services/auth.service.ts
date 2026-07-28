import { Injectable } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from './api.service';

import {

LoginResponse,

} from '../models/login-response';

import {

AuthResponse,

} from '../models/auth-response';

@Injectable({

providedIn:'root'

})

export class AuthService{

constructor(

private api:ApiService

){}

login(data:any):Observable<LoginResponse>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  return this.api.post('/api/auth/login', data, {
    headers,
  }) as Observable<LoginResponse>;
}

register(data:any){
  return this.api.post('/api/auth/register', data);
}

selectRole(roleId:string):Observable<AuthResponse>{
    const token = localStorage.getItem('tempToken');

    return this.api.post(
      '/api/auth/select-role',
      { roleId },
      {
        headers: new HttpHeaders({
          Authorization: token ? `Bearer ${token}` : '',
        }),
      },
    ) as Observable<AuthResponse>;
  }
}