import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {Style} from 'node:util';
import {environment} from '../../../../environments/environment';

@Injectable()
export class RegisterService {

  private readonly url = `${environment.api}/styles`;

  private readonly http = inject(HttpClient);

  getAllStyles(): Observable<Style[]> {
    return this.http.get<Style[]>(this.url)
  }
}
