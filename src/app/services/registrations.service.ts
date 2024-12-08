import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Registration } from '../models/registration';

@Injectable()
export class RegistrationsService {
  private readonly url = `${environment.api}/registrations`;
  private readonly urlEvByUsId = `${this.url}/events`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Registration>> {
    return this.http.get<ContainerList<Registration>>(this.url);
  }

  getById(
    userId: number,
    eventId: number,
  ): Observable<Container<Registration>> {
    return this.http.get<Container<Registration>>(
      `${this.url}/${userId}/${eventId}`,
    );
  }

  eventsRegisteredByUser(id: number): Observable<Container<number[]>> {
    return this.http.get<Container<number[]>>(`${this.urlEvByUsId}/${id}`);
  }

  create(newRegistration: Registration): Observable<Container<Registration>> {
    return this.http.post<Container<Registration>>(this.url, newRegistration);
  }

  update(
    upRegistration: Registration,
    registedId: number,
  ): Observable<Container<Registration>> {
    return this.http.put<Container<Registration>>(
      `${this.url}/${registedId}`,
      upRegistration,
    );
  }

  remove(userId: number, eventId: number): Observable<Container<Registration>> {
    return this.http.delete<Container<Registration>>(
      `${this.url}/${userId}/${eventId}`,
    );
  }
}
