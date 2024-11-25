import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Event } from '../models/event';

@Injectable()
export class EventsService {
  private readonly url = `${environment.api}/events`;
  private readonly imgUrl = environment.media;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Event>> {
    return this.http.get<ContainerList<Event>>(this.url).pipe(
      map(arrayEvents => {
        arrayEvents.data.forEach(event => {
          if (event.images && event.images.length > 0) {
            event.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
        });
        return arrayEvents;
      }),
    );
  }

  getById(id: number): Observable<Container<Event>> {
    return this.http.get<Container<Event>>(`${this.url}/${id}`).pipe(
      map(event => {
        if (event.data.images && event.data.images.length > 0) {
          event.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return event;
      }),
    );
  }

  create(newEvent: Event): Observable<Container<Event>> {
    return this.http.post<Container<Event>>(this.url, newEvent).pipe(
      map(event => {
        if (event.data.images && event.data.images.length > 0) {
          event.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return event;
      }),
    );
  }

  update(eventToUpdate: Event, id: number): Observable<Container<Event>> {
    return this.http
      .post<Container<Event>>(`${this.url}/${id}`, eventToUpdate)
      .pipe(
        map(event1 => {
          if (event1.data.images && event1.data.images.length > 0) {
            event1.data.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
          return event1;
        }),
      );
  }

  remove(id: number): Observable<Container<string>> {
    return this.http.delete<Container<string>>(`${this.url}/${id}`);
  }
}
