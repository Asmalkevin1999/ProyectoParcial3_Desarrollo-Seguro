import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SelectRoleService {

  private api = 'http://localhost:3005/auth';

  constructor(
    private http: HttpClient
  ) {}

  selectRole(roleId: string) {

    const token = localStorage.getItem('tempToken');

    return this.http.post(

      `${this.api}/select-role`,

      {
        roleId
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

  }

}