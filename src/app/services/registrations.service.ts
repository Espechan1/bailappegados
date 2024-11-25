import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Registration } from '../models/registration';

@Injectable()
export class RegistrationsService {
  private readonly url = `${environment.api}/registrations`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Registration>> {
    return this.http.get<ContainerList<Registration>>(this.url);
  }

  getById(id: number): Observable<Container<Registration>> {
    return this.http.get<Container<Registration>>(`${this.url}/${id}`);
  }

  create(newRegistration: Registration): Observable<Container<Registration>> {
    return this.http.post<Container<Registration>>(this.url, newRegistration);
  }
}
