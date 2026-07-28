import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);

  private api = environment.apiUrl;

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/auth/profile`);
  }

  update(data: any): Observable<any> {
    return this.http.patch(
      `${this.api}/auth/profile`,
      data
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.patch(
      `${this.api}/auth/change-password`,
      data
    );
  }

}