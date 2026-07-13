import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleMenusService {

  private http = inject(HttpClient);

  private api = environment.apiUrl;

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/roles`);
  }

  getMenus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/menus`);
  }

  getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/role-menus`);
  }

  assign(data: any): Observable<any> {
    return this.http.post(`${this.api}/role-menus`, data);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.api}/role-menus/${id}`);
  }

}