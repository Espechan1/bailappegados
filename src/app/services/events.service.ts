import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Container, ContainerList} from '../models/container';
import {Event} from '../models/event';


@Injectable()
export class EventsService {

  private readonly url = `${environment.api}/events`;
  private readonly imgUrl = environment.api.slice(0, -4)

  private readonly http = inject(HttpClient);

  getEvents(): Observable<ContainerList<Event>> {
    return this.http.get<ContainerList<Event>>(this.url).pipe(
      map(containerList => { //de cada contenedor del listado
        containerList.data.forEach(event => { //hago un forEach y si existe images
          if (event.images.length > 0) {
            event.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`; //modifico la url en base al environment.
            })
          }
        });
        return containerList;
      })
    )
  }

  getEvent(id: number): Observable<Container<Event>> {
    return this.http.get<Container<Event>>(`${this.url}/${id}`).pipe(
      map(container => {
        if (container.data && container.data.images.length > 0) {
          container.data.images[0].url = `${this.url}/${container.data.images[0].url}`;
        }
        return container;
      })
    )
  }

}
