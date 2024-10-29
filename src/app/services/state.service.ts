import { Injectable } from '@angular/core';
import {LoginDecodeResponse} from '../models/login-response';
import {UserLogged} from '../models/user';

@Injectable({
  providedIn: "root"
})
export class StateService {

  private _token!: LoginDecodeResponse; //Devuelve un objeto con el id del user, el rol y la expiración del token decodificados
  private _userLogged!: UserLogged; // Devuelve un boolean del tipo de rol, user=isLogged, manager o admin

  get userLogged(): UserLogged {
    return this._userLogged;
  }

  set userLogged(value: UserLogged) {
    this._userLogged = value;
  }

  get token(): LoginDecodeResponse {
    return this._token;
  }

  set token(value: LoginDecodeResponse) {
    this.userLogged = {
      isLogged: value.roles.includes(3), //role_id = 3
    }

    this.userLogged.isManager = this.userLogged.isLogged && value.roles.includes(2)
    this.userLogged.isAdmin = this.userLogged.isLogged && value.roles.includes(1)

    this._token = value;
  }
}
