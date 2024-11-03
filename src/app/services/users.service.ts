import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../models/container';
import { User } from '../models/user';

@Injectable()
export class UsersService {
  private readonly url = `${environment.api}/users`;

  private readonly http = inject(HttpClient);

  getById(id: number): Observable<Container<User>> {
    return this.http.get<Container<User>>(`${this.url}/${id}`);
  }
}
