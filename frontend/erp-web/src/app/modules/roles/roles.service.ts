import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/roles`;

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getRole(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(role: any): Observable<any> {
    return this.http.post<any>(this.api, role);
  }

  update(id: string, role: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}`, role);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}