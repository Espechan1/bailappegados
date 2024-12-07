import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Container, ContainerList } from '../models/container';
import { Classroom, ClassroomOutput } from '../models/classroom';

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
          classroom.opening = new Date(classroom.opening as Date);
          classroom.expiration = new Date(classroom.expiration as Date);
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
        classroom.data.opening = new Date(classroom.data.opening as Date);
        classroom.data.expiration = new Date(classroom.data.expiration as Date);
        return classroom;
      }),
    );
  }

  create(newClassroom: ClassroomOutput): Observable<Container<Classroom>> {
    const formData = new FormData();
    formData.set('name', newClassroom.name);
    formData.set('phone_number', newClassroom.phone_number);
    if (newClassroom.opening)
      formData.set(
        'expiration',
        newClassroom.opening.toLocaleString().replace(',', ''),
      );
    if (newClassroom.expiration)
      formData.set(
        'expiration',
        newClassroom.expiration.toLocaleString().replace(',', ''),
      );
    if (newClassroom.price)
      formData.set('price', newClassroom.price.toString());
    formData.set('premise_id', newClassroom.premise_id.toString());
    formData.set('style_id', newClassroom.style_id.toString());
    formData.set('teacher_id', newClassroom.teacher_id.toString());

    return this.http.post<Container<Classroom>>(this.url, formData).pipe(
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

  update(
    classToUpdate: ClassroomOutput,
    id: number,
  ): Observable<Container<Classroom>> {
    const formData = new FormData();
    formData.set('name', classToUpdate.name);
    formData.set('phone_number', classToUpdate.phone_number);
    if (classToUpdate.opening)
      formData.set(
        'expiration',
        classToUpdate.opening.toLocaleString().replace(',', ''),
      );
    if (classToUpdate.expiration)
      formData.set(
        'expiration',
        classToUpdate.expiration.toLocaleString().replace(',', ''),
      );
    if (classToUpdate.price)
      formData.set('price', classToUpdate.price.toString());
    formData.set('premise_id', classToUpdate.premise_id.toString());
    formData.set('style_id', classToUpdate.style_id.toString());
    formData.set('teacher_id', classToUpdate.teacher_id.toString());
    return this.http
      .post<Container<Classroom>>(`${this.url}/${id}`, classToUpdate)
      .pipe(
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

  remove(id: number): Observable<Container<string>> {
    return this.http.delete<Container<string>>(`${this.url}/${id}`);
  }
}
