import { Injectable } from '@angular/core';

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

return this.api.post(

'/auth/login',

data

) as Observable<LoginResponse>;

}

register(data:any){

return this.api.post(

'/auth/register',

data

);

}

selectRole(

roleId:string

):Observable<AuthResponse>{

return this.api.post(

'/auth/select-role',

{

roleId

}

) as Observable<AuthResponse>;

}

}