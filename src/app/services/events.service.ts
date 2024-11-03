import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Event } from '../models/event';

@Injectable()
export class EventsService {
  private readonly url = `${environment.api}/events`;

  private readonly http = inject(HttpClient);

  getEvents(): Observable<ContainerList<Event>> {
    return this.http.get<ContainerList<Event>>(this.url);
  }
  getById(id: number): Observable<Container<Event>> {
    return this.http.get<Container<Event>>(`${this.url}/${id}`);
  }
}
