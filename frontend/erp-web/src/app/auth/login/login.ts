import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({

  selector:'app-login',

  standalone:true,

  imports:[
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl:'./login.html',

  styleUrl:'./login.scss'

})
export class LoginComponent{

  username='';

  password='';

  constructor(
    private auth:AuthService,
    private router:Router
  ){}

  login(){

this.auth.login({

username:this.username,

password:this.password

})

.subscribe({

next: (res: any) => {

  console.log(res);

  localStorage.setItem(
    'tempToken',
    res.tempToken
  );

  localStorage.setItem(
    'roles',
    JSON.stringify(res.roles)
  );

  this.router.navigate([
    '/select-role'
  ]);

},

error:(err)=>{

alert(

err.error.message

);

}

});

}

}