import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private api: ApiService) {}

  getMyMenu() {
    return this.api.get('/api/menus/my-menu');
  }
}
