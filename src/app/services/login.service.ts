import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Credential } from '../models/credential';
import { LoginResponse } from '../models/login-response';

@Injectable()
export class LoginService {
  private readonly url = `${environment.api}/login`;
  private readonly http = inject(HttpClient);

  login(credentials: Credential): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, credentials);
  }
}

/**
 * los parámetros del metodo son lo que envío por post en el body, el observable el que espera el tipo de respuesta del
 * servidor. Lo que pongo en post<es el tipo de dato que espero y los parámetros del post son la url y el body que está
 * en los parámetros del metodo. El observable es el que espera la respuesta sabiendo el tipo de dato al estar parametri-
 * zado en el observable.
 * */
