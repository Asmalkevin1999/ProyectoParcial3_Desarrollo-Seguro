import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector:'app-modules',
  standalone:true,
  imports:[
    CommonModule
  ],
  templateUrl:'./modules.html',
  styleUrl:'./modules.scss'
})
export class ModulesComponent {

}