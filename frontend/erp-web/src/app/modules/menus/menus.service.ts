import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/menus`;

  getMenus(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getMenu(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(menu: any): Observable<any> {
    return this.http.post<any>(this.api, menu);
  }

  update(id: string, menu: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}`, menu);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}