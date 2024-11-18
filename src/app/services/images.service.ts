import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Photo } from '../models/photo';

@Injectable()
export class ImagesService {
  private readonly url = `${environment.api}/images`;

  private readonly http = inject(HttpClient);

  getImages(): Observable<ContainerList<Photo>> {
    return this.http.get<ContainerList<Photo>>(this.url);
  }

  getImage(id: number, type: string): Observable<Container<Photo>> {
    return this.http.get<Container<Photo>>(`${this.url}/${id}/${type}`);
  }
}
