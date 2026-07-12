import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private api =
    'http://localhost:3005/menus';

  constructor(
    private http: HttpClient
  ) {}

  getMyMenu() {

    const token =
      localStorage.getItem(
        'accessToken'
      );

    return this.http.get(
      `${this.api}/my-menu`,
      {
        headers:
          new HttpHeaders({
            Authorization:
              `Bearer ${token}`
          })
      }
    );

  }

}