import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  MenuService
} from '../../auth/services/menu.service';

@Component({

  selector:'app-dashboard',

  standalone:true,

  imports:[
    CommonModule
  ],

  templateUrl:'./dashboard.html',

  styleUrl:'./dashboard.scss'

})

export class DashboardComponent implements OnInit{

  modules:any[]=[];

  username:string='Usuario';

  role:string='';

  constructor(

    private menuService:MenuService,

    private router:Router,

    private cd:ChangeDetectorRef

  ){}

  ngOnInit():void{

    console.log("ENTRO DASHBOARD");

    this.username =
      localStorage.getItem('username') ?? 'Usuario';

    this.role =
      localStorage.getItem('role') ?? '';

    this.loadMenu();

  }

  loadMenu(){

    this.menuService
    .getMyMenu()
    .subscribe({

      next:(res:any)=>{

        console.log(res);

        this.modules=[...res];

        this.cd.detectChanges();

      },

      error:(err)=>{

        console.log(err);

      }

    });

  }

  go(url:string){

    this.router.navigate([url]);

  }

  logout(){

    localStorage.clear();

    this.router.navigate([
      '/login'
    ]);

  }

}