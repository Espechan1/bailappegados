import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Premise } from '../models/premise';
import { Container, ContainerList } from '../models/container';

@Injectable()
export class PremisesService {
  private readonly url = `${environment.api}/premises`;

  private readonly http = inject(HttpClient); // = constructor(private http: HttpClient) {}

  getPremises(): Observable<ContainerList<Premise>> {
    return this.http.get<ContainerList<Premise>>(this.url);
  }

  getById(id: number): Observable<Container<Premise>> {
    return this.http.get<Container<Premise>>(`${this.url}/${id}`);
  }
}
/*
* formatDate(
  value: string | number | Date,
  format: string,
  locale: string,
  timezone?: string
): string;
* */
