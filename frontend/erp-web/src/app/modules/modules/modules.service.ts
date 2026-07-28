import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/api/modules`;

  getModules(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getModule(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(module: any): Observable<any> {
    return this.http.post<any>(this.api, module);
  }

  update(id: string, module: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}`, module);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}