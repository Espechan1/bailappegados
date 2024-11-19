import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Classroom } from '../models/classroom';

@Injectable()
export class ClassroomsService {
  private readonly url = `${environment.api}/classrooms`;
  private readonly imgUrl = environment.media;
  private readonly http = inject(HttpClient);

  getAll(): Observable<ContainerList<Classroom>> {
    return this.http.get<ContainerList<Classroom>>(this.url).pipe(
      map(arrayClassrooms => {
        arrayClassrooms.data.forEach(classroom => {
          if (classroom.images && classroom.images.length > 0) {
            classroom.images.forEach(img => {
              img.url = `${this.imgUrl}/${img.url}`;
            });
          }
        });
        return arrayClassrooms;
      }),
    );
  }

  getById(id: number): Observable<Container<Classroom>> {
    return this.http.get<Container<Classroom>>(`${this.url}/${id}`).pipe(
      map(classroom => {
        if (classroom.data.images && classroom.data.images.length > 0) {
          classroom.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return classroom;
      }),
    );
  }

  create(newClassroom: Classroom): Observable<Container<Classroom>> {
    return this.http.post<Container<Classroom>>(this.url, newClassroom).pipe(
      map(classroom => {
        if (classroom.data.images && classroom.data.images.length > 0) {
          classroom.data.images.forEach(img => {
            img.url = `${this.imgUrl}/${img.url}`;
          });
        }
        return classroom;
      }),
    );
  }
}
