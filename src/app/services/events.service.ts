import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Event, EventOutput } from '../models/event';

@Injectable()
export class EventsService {
  private readonly url = `${environment.api}/events`;
  private readonly urlIncoming = `${this.url}/incoming`;

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
          event.opening = new Date(event.opening as Date);
          event.expiration = new Date(event.expiration as Date);
        });
        return arrayEvents;
      }),
    );
  }

  getIncoming(): Observable<ContainerList<Event>> {
    return this.http.get<ContainerList<Event>>(this.urlIncoming).pipe(
      map(arrayEvents => {
        arrayEvents.data.forEach(event => {
          if (event.images && event.images.length > 0) {
            event.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
          event.opening = new Date(event.opening as Date);
          event.expiration = new Date(event.expiration as Date);
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
        event.data.opening = new Date(event.data.opening as Date);
        event.data.expiration = new Date(event.data.expiration as Date);
        return event;
      }),
    );
  }

  create(newEvent: EventOutput): Observable<Container<Event>> {
    const formData = new FormData();
    formData.set('name', newEvent.name);
    formData.set('dance_instructors', newEvent.dance_instructors);
    formData.set('dj', newEvent.dj);
    formData.set('style_id', newEvent.style_id.toString());
    formData.set('premise_id', newEvent.premise_id.toString());
    if (newEvent.price) formData.set('price', newEvent.price.toString());
    if (newEvent.opening)
      formData.set(
        'expiration',
        newEvent.opening.toLocaleString().replace(',', ''),
      );
    if (newEvent.expiration)
      formData.set(
        'expiration',
        newEvent.expiration.toLocaleString().replace(',', ''),
      );

    return this.http.post<Container<Event>>(this.url, formData).pipe(
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

  update(eventToUpdate: EventOutput, id: number): Observable<Container<Event>> {
    const formData = new FormData();
    formData.set('name', eventToUpdate.name);
    formData.set('dance_instructors', eventToUpdate.dance_instructors);
    formData.set('dj', eventToUpdate.dj);
    formData.set('style_id', eventToUpdate.style_id.toString());
    formData.set('premise_id', eventToUpdate.premise_id.toString());
    if (eventToUpdate.price)
      formData.set('price', eventToUpdate.price.toString());
    if (eventToUpdate.opening)
      formData.set(
        'expiration',
        eventToUpdate.opening.toLocaleString().replace(',', ''),
      );
    if (eventToUpdate.expiration)
      formData.set(
        'expiration',
        eventToUpdate.expiration.toLocaleString().replace(',', ''),
      );
    return this.http.post<Container<Event>>(`${this.url}/${id}`, formData).pipe(
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
