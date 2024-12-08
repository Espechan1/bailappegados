import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Premise, PremiseOutput } from '../models/premise';
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

  create(newPremise: PremiseOutput): Observable<Container<Premise>> {
    const formData = new FormData();
    formData.set('name', newPremise.name);
    formData.set('email', newPremise.email);
    formData.set('address', newPremise.address);
    formData.set('phone_number', newPremise.phone_number);
    if (newPremise.person_contact)
      formData.set('person_contact', newPremise.person_contact);
    if (newPremise.web) formData.set('web', newPremise.web);
    if (newPremise.schedule)
      formData.set('schedule', JSON.stringify(newPremise.schedule));
    if (newPremise.location)
      formData.set('location', JSON.stringify(newPremise.location));
    return this.http.post<Container<Premise>>(this.url, formData).pipe(
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

  update(
    premiseToUpdate: PremiseOutput,
    id: number,
  ): Observable<Container<Premise>> {
    const formData = new FormData();
    formData.set('name', premiseToUpdate.name);
    formData.set('email', premiseToUpdate.email);
    formData.set('address', premiseToUpdate.address);
    formData.set('phone_number', premiseToUpdate.phone_number);
    if (premiseToUpdate.person_contact)
      formData.set('person_contact', premiseToUpdate.person_contact);
    if (premiseToUpdate.web) formData.set('web', premiseToUpdate.web);
    if (premiseToUpdate.schedule)
      formData.set('schedule', JSON.stringify(premiseToUpdate.schedule));
    if (premiseToUpdate.location)
      formData.set('location', JSON.stringify(premiseToUpdate.location));
    if (premiseToUpdate.images && typeof premiseToUpdate.images != 'object')
      formData.set('image', premiseToUpdate.images);

    return this.http
      .post<Container<Premise>>(`${this.url}/${id}`, formData)
      .pipe(
        map(premise => {
          if (premise.data.images && premise.data.images.length > 0) {
            premise.data.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
          console.log(premise);
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
