import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleModulesService {

  private http = inject(HttpClient);

  private api = environment.apiUrl;

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/roles`);
  }

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/modules`);
  }

  getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/role-modules`);
  }

  assign(data: any): Observable<any> {
    return this.http.post(`${this.api}/role-modules`, data);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.api}/role-modules/${id}`);
  }

}