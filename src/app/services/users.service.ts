import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { User } from '../models/user';

@Injectable()
export class UsersService {
  private readonly url = `${environment.api}/users`;
  private readonly imgUrl = environment.media;

  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<User>> {
    return this.http.get<ContainerList<User>>(this.url).pipe(
      map(arrayUsers => {
        arrayUsers.data.forEach(user => {
          if (user.images && user.images.length > 0) {
            user.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
        });
        return arrayUsers;
      }),
    );
  }

  getById(id: number): Observable<Container<User>> {
    return this.http.get<Container<User>>(`${this.url}/${id}`).pipe(
      map(user => {
        if (user.data.images && user.data.images.length > 0) {
          user.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return user;
      }),
    );
  }

  create(newUser: User): Observable<Container<User>> {
    return this.http.post<Container<User>>(this.url, newUser).pipe(
      map(user => {
        if (user.data.images && user.data.images.length > 0) {
          user.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return user;
      }),
    );
  }
}
