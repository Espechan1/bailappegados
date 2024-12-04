import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Credential } from '../../models/credential';
import { take } from 'rxjs';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';

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
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [LoginService, StateService],
})
export class LoginComponent implements OnInit {
  private readonly loginService = inject(LoginService);
  private readonly stateService = inject(StateService);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.max(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]$/),
    ]),
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

  login(): void {
    this.loginService
      .login(this.loginForm.value as Credential) //Hace la consulta de login y devuelve el token s/decode
      .pipe(take(1))
      .subscribe(value => {
        localStorage.setItem('token', value.token);
        console.log(this.stateService.token); // decodificado, devuelve un objeto tipo LoginDecodeResponse
        console.log(this.stateService.userLogged); //devuelve el rol.
        this.router.navigate(['my-account']).then();
      });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      for (const controlsKey in this.loginForm.controls) {
        this.loginForm.get(controlsKey)?.markAsDirty();
        this.loginForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
  }
}
