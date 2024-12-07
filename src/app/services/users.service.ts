import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { User, UserOutput } from '../models/user';

@Injectable()
export class UsersService {
  private readonly url = `${environment.api}/users`;
  private readonly urlUserRegistered = `${environment.api}/users/events`;
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
          user.birthday = new Date(user.birthday as Date);
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
        user.data.birthday = new Date(user.data.birthday as Date);
        return user;
      }),
    );
  }

  create(newUser: UserOutput): Observable<Container<User>> {
    const formData = new FormData();
    formData.set('name', newUser.name);
    formData.set('email', newUser.email);
    if (newUser.description) formData.set('description', newUser.description);
    if (newUser.location) formData.set('location', newUser.location);
    if (newUser.birthday)
      formData.set('birthday', newUser.birthday.toISOString().split('T')[0]);
    if (newUser.genre) formData.set('genre', newUser.genre.toString());
    if (newUser.styles)
      formData.set(
        'styles',
        JSON.stringify(
          newUser.styles.map(s => {
            return s.id;
          }),
        ),
      );
    if (newUser.password) formData.set('password', newUser.password);
    if (newUser.images) formData.set('image', newUser.images);

    return this.http.post<Container<User>>(this.url, formData).pipe(
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

  update(userToUpdate: UserOutput, id: number): Observable<Container<User>> {
    const formData = new FormData();
    formData.set('name', userToUpdate.name);
    if (userToUpdate.description)
      formData.set('description', userToUpdate.description);
    if (userToUpdate.location) formData.set('location', userToUpdate.location);
    formData.set('email', userToUpdate.email);
    if (userToUpdate.birthday)
      formData.set(
        'birthday',
        userToUpdate.birthday.toISOString().split('T')[0],
      );
    if (userToUpdate.genre)
      formData.set('genre', userToUpdate.genre.toString());
    if (userToUpdate.styles)
      formData.set(
        'styles',
        JSON.stringify(
          userToUpdate.styles.map(s => {
            return s.id;
          }),
        ),
      );
    if (userToUpdate.password) formData.set('password', userToUpdate.password);
    if (userToUpdate.images && typeof userToUpdate.images !== 'string')
      formData.set('image', userToUpdate.images);

    return this.http.post<Container<User>>(`${this.url}/${id}`, formData).pipe(
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

  remove(id: number): Observable<Container<string>> {
    return this.http.delete<Container<string>>(`${this.url}/${id}`);
  }

  getUsersByEventId(id: number): Observable<ContainerList<User>> {
    return this.http.get<ContainerList<User>>(
      `${this.urlUserRegistered}/${id}`,
    );
  }
}

// Cabecera envio token: const token = localStorage.getItem("token")
// if (!token){
//   console.error("Token not found")
// }
// const headers = { 'Authorization': 'Bearer ' + token }
