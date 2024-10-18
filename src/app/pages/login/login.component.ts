import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CheckboxModule,
    ButtonDirective,
    Ripple,
    InputTextModule,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  ngOnInit():void {
    sessionStorage.clear()
  }

  login():void{
    sessionStorage.setItem('token', 'mockToken')
  }
}
