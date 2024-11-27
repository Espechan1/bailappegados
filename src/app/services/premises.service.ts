import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Premise } from '../models/premise';
import { Container, ContainerList } from '../models/container';

@Injectable()
export class PremisesService {
  private readonly url = `${environment.api}/premises`;
  private readonly urlPremisesById = `${environment.api}/premises/users`;
  private readonly imgUrl = environment.media;

  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Premise>> {
    return this.http.get<ContainerList<Premise>>(this.url).pipe(
      map(arrayPremises => {
        arrayPremises.data.forEach(premise => {
          if (premise.images && premise.images.length > 0) {
            premise.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
        });
        return arrayPremises;
      }),
    );
  }

  getById(id: number): Observable<Container<Premise>> {
    return this.http.get<Container<Premise>>(`${this.url}/${id}`).pipe(
      map(premise => {
        if (premise.data.images && premise.data.images.length > 0) {
          premise.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return premise;
      }),
    );
  }

  create(newPremise: Premise): Observable<Container<Premise>> {
    return this.http.post<Container<Premise>>(this.url, newPremise).pipe(
      map(premise => {
        if (premise.data.images && premise.data.images.length > 0) {
          premise.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return premise;
      }),
    );
  }

  update(premiseToUpdate: Premise, id: number): Observable<Container<Premise>> {
    return this.http
      .post<Container<Premise>>(`${this.url}/${id}`, premiseToUpdate)
      .pipe(
        map(premise => {
          if (premise.data.images && premise.data.images.length > 0) {
            premise.data.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
          return premise;
        }),
      );
  }

  remove(id: number): Observable<Container<string>> {
    return this.http.delete<Container<string>>(`${this.url}/${id}`);
  }

  premisesByUserId(id: number): Observable<ContainerList<Premise>> {
    return this.http
      .get<ContainerList<Premise>>(`${this.urlPremisesById}/${id}`)
      .pipe(
        map(arrayPremises => {
          arrayPremises.data.forEach(premise => {
            if (premise.images && premise.images.length > 0) {
              premise.images.forEach(img => {
                img.url = `${this.imgUrl}/${img.url}`;
              });
            }
          });
          return arrayPremises;
        }),
      );
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
