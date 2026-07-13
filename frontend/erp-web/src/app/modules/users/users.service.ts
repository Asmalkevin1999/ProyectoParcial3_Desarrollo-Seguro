import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/users`;

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(user: any): Observable<any> {
    return this.http.post<any>(this.api, user);
  }

  update(id: string, user: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}`, user);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}