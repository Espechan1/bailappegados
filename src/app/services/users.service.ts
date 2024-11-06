import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Container, ContainerList} from '../models/container';
import {User} from '../models/user';
import {Event} from '../models/event';

@Injectable()
export class UsersService {

  private readonly url = `${environment.api}/users`;
  private readonly imgUrl = environment.media

  private readonly http = inject(HttpClient);

  getUsers(): Observable<ContainerList<User>> {
    return this.http.get<ContainerList<User>>(this.url).pipe(
      map(containerList => { //de cada contenedor del listado
        containerList.data.forEach(user => { //hago un forEach y si existe images
          if (user.images.length > 0) {
            user.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`; //modifico la url en base al environment.
            })
          }
        });
        return containerList;
      })
    )
  }

  getUser(id: number): Observable<Container<User>> {
    return this.http.get<Container<User>>(`${this.url}/${id}`).pipe(
      map(user => {
        if (user.data && user.data.images.length > 0) {
          user.data.images[0].url = `${this.url}/${user.data.images[0].url}`;
        }
        return user;
      })
    )
  }
}
