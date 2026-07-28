import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) {}

  // ==================== SALES ====================
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sales`);
  }

  createSale(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, data);
  }

  updateSale(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sales/${id}`, data);
  }

  deleteSale(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sales/${id}`);
  }

  // ==================== INVENTORY ====================
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventory/categories`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventory/categories`, data);
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/inventory/categories/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/inventory/categories/${id}`);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inventory/products`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventory/products`, data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/inventory/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/inventory/products/${id}`);
  }

  // ==================== HR ====================
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hr/employees`);
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/hr/employees`, data);
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/hr/employees/${id}`, data);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hr/employees/${id}`);
  }

  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hr/attendance`);
  }

  // ==================== USERS ====================
  getUserProfiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/profiles`);
  }

  getUserSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/sessions`);
  }

  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/audit-logs`);
  }
}
