import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) {}

  get(url: string) {

    return this.http.get(

      `${environment.apiUrl}${url}`,

      {
        headers: this.headers(),
      },

    );

  }

  post(
    url: string,
    body: any,
  ) {

    return this.http.post(

      `${environment.apiUrl}${url}`,

      body,

      {
        headers: this.headers(),
      },

    );

  }

  put(
    url: string,
    body: any,
  ) {

    return this.http.put(

      `${environment.apiUrl}${url}`,

      body,

      {
        headers: this.headers(),
      },

    );

  }

  delete(url: string) {

    return this.http.delete(

      `${environment.apiUrl}${url}`,

      {
        headers: this.headers(),
      },

    );

  }

  private headers() {

    const token =
      localStorage.getItem('accessToken');

    return new HttpHeaders({

      Authorization: token
        ? `Bearer ${token}`
        : '',

    });

  }

}