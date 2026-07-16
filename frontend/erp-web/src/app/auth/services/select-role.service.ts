import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelectRoleService {
  private api = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  selectRole(roleId: string) {
    const token = localStorage.getItem('tempToken');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post(
      `${this.api}/select-role`,
      { roleId: roleId.trim() },
      headers ? { headers } : {},
    );
  }
}
