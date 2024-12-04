import { Injectable } from '@angular/core';
import {
  LoginDecodeResponse,
  TokenDecodeResponse,
} from '../models/login-response';
import { UserLogged } from '../models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _token?: LoginDecodeResponse; //Devuelve un objeto con el id del user, el rol y la expiración del token decodificados
  private _userLogged!: UserLogged; // Devuelve un obj del tipo de rol, user=isLogged, manager o admin

  get userLogged(): UserLogged {
    const token = this.token;
    const userLogged: UserLogged = {};
    const roles = token?.roles ?? [];

    userLogged.isLogged = token !== undefined && roles.includes(3); //si tiene token
    userLogged.isManager = userLogged.isLogged && roles.includes(2);
    userLogged.isTeacher = userLogged.isTeacher && roles.includes(4);
    userLogged.isAdmin = userLogged.isManager && roles.includes(1);

    return userLogged;
  }

  get token(): LoginDecodeResponse | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      //tiene valor
      const tokenDecode = jwtDecode(token) as TokenDecodeResponse; //Puede o no existir por el tipo
      return {
        userId: tokenDecode.userId,
        roles: tokenDecode.roles.map(role => role.id),
        exp: tokenDecode.exp,
      };
    }
    return undefined;
  }
}
