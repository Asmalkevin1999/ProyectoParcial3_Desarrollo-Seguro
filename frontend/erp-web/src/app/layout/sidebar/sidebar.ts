import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuService } from '../../auth/services/menu.service';

@Component({
  selector:'app-sidebar',
  standalone:true,
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl:'./sidebar.html',
  styleUrl:'./sidebar.scss'
})
export class SidebarComponent
implements OnInit{

  modules:any[]=[];

  constructor(
    private menuService:MenuService
  ){}

  ngOnInit(): void {

    this.menuService
      .getMyMenu()
      .subscribe({

        next:(res:any)=>{

          this.modules=res;

        }

      });

  }

}