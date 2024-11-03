import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Container, ContainerList} from '../models/container';
import {Image} from '../models/image';

@Injectable()
export class ImagesService {

  private readonly url = `${environment.api}/images`;

  private readonly http = inject(HttpClient);

  getImages(): Observable<ContainerList<Image>> {
    return this.http.get<ContainerList<Image>>(this.url)
  }

  getById(id: number, type: string): Observable<Container<Image>>{
    return this.http.get<Container<Image>>(`${this.url}/${id}/${type}`)
  }
}
