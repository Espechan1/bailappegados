import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, Observable} from 'rxjs';
import {Premise} from '../models/premise';
import {Container, ContainerList} from '../models/container';

@Injectable()
export class PremisesService {

  private readonly url = `${environment.api}/premises`;
  private readonly imgUrl = environment.media

  private readonly http = inject(HttpClient); // = constructor(private http: HttpClient) {}

  getPremises(): Observable<ContainerList<Premise>> {
    return this.http.get<ContainerList<Premise>>(this.url).pipe(
      map(arrayPremises => {
        arrayPremises.data.forEach(premise => {
          if (premise.images.length > 0){
            premise.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            })
          }
        });
        return arrayPremises;
      })
    )
  }

  getPremise(id: number): Observable<Container<Premise>>{
    return this.http.get<Container<Premise>>(`${this.url}/${id}`).pipe(
      map(premise => {
        if (premise.data && premise.data.images.length > 0) {
          premise.data.images[0].url = `${this.url}/${premise.data.images[0].url}`;
        }
        return premise;
      })
    )
  }

  postPremise(newPremise: Premise): Observable<Container<Premise>> {
    return this.http.post<Container<Premise>>(this.url, newPremise)
    .pipe(
      map(premise => {
        if (premise.data && premise.data.images.length > 0) {
          premise.data.images[0].url = `${this.url}/${premise.data.images[0].url}`;
        }
        return premise;
      })
    )
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

