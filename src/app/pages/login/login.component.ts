import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {Credential} from '../../models/credential';
import {take} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {StateServiceService} from '../../services/state-service.service';
import {TokenDecodeResponse} from '../../models/login-response';
import {Router} from '@angular/router';

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
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  private readonly loginService = inject(LoginService);
  private readonly stateService = inject(StateServiceService);
  constructor(private router: Router){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.max(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]$/)])
  })

  ngOnInit(): void {
    sessionStorage.clear()
  }

  login(): void {
    this.loginService.login(this.loginForm.value as Credential)
      .pipe(take(1))
      .subscribe(value => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', value.token);
        }
        const tokenDecode = jwtDecode(value.token) as TokenDecodeResponse;
        this.stateService.token = {
          user: tokenDecode.user,
          roles: tokenDecode.roles.map(value1 => value1.id),
          exp: tokenDecode.exp
        }
        console.log(this.stateService.token);
        this.router.navigate(['/myaccount']);
      });
  }
}


/**
 * subscribe(): es el metodo que uso para escuchar los datos que emite un Observable. para qué sirve? cuando te suscribes
 * le dices a tu aplicación que quieres recibir los datos que generas. Ej: en mi login me suscribo para recibir el token.
 * TE PERMITE RECIBIR DATOS DEL OBSERVABLE
 *
 * pipe() metodo que permite encadenar varios operadores de RxJS para transformar o filtrar los datos que emite un Observable.
 * Te ayuda a modificar la forma en que recibes o manejas los datos sin cambiar el Observable original. Ej: añadiendo cosas.
 * TE PERMITE TRANSFORMAR O FILTRAR LOS DATOS ANTES DE RECIBIRLOS
 *
 *
 * take() es un operador que se usa dentro de pipe para limitar la cantidad de valores que recibes del Observable. Ejemplo:
 * (1) quiero el primer valor y te desuscribes.
 * LIMITA LA CANTIDAD DE VECES QUE RECIBO INFORMACIÓN DE LA SUSCRIPCIÓN, CUANDO LLEGA A LA CANTIDAD SE DESUSCRIBE.
 *
 */
