import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {RegisterService} from './services/register.service';
import {JsonPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CheckboxModule} from 'primeng/checkbox';
import {Ripple} from 'primeng/ripple';
import {RouterLink} from '@angular/router';
import {MultiSelectModule} from 'primeng/multiselect';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    PasswordModule,
    DividerModule,
    NgForOf,
    FloatLabelModule,
    CheckboxModule,
    Ripple,
    NgOptimizedImage,
    RouterLink,
    MultiSelectModule,
    JsonPipe,
    NgIf
  ],
  providers: [RegisterService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent { //implements OnInit

  private readonly registerService = inject(RegisterService); //= constructor(private readonly registerService: RegisterService?) {


  readonly  genders = [{
    key: 'H',
    name: 'Hombre',
  }, {
    key: 'F',
    name: 'Mujer',
  }, {
    key: 'O',
    name: 'Otros',
  }];

  signUpForm = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    description: new FormControl(),
    email: new FormControl('', [Validators.email, Validators.required]),
    location: new FormControl(),
    styles: new FormControl(),
    gender: new FormControl(),
    birthday: new FormControl(),
    confirm: new FormControl(false, Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.max(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/)])
  })

  onRegister():void{
    if(this.signUpForm.invalid){
      console.log("Algo ta mal")
      for (let controlsKey in this.signUpForm.controls) {
        this.signUpForm.get(controlsKey)?.markAsDirty()
        this.signUpForm.get(controlsKey)?.updateValueAndValidity()
      }
      return
    }
    console.log("funciono")
  }

  // ngOnInit(): void {
  //  this.getAllStyles()
  // }
}
