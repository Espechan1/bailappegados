import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Style } from '../models/style';
import { Container, ContainerList } from '../models/container';

@Injectable()
export class StylesService {
  private readonly url = `${environment.api}/styles`;

  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Style>> {
    return this.http.get<ContainerList<Style>>(this.url);
  }

  getById(id: number): Observable<Container<Style>> {
    return this.http.get<Container<Style>>(`${this.url}/${id}`);
  }

  create(newStyle: Style): Observable<Container<Style>> {
    return this.http.post<Container<Style>>(this.url, newStyle);
  }

  update(style: Style, id: number): Observable<Container<Style>> {
    return this.http.put<Container<Style>>(`${this.url}/${id}`, style);
  }

  delete(id: number): Observable<Container<Style>> {
    return this.http.delete<Container<Style>>(`${this.url}/${id}`);
  }
}
