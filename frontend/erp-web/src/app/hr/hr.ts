import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  status: boolean;
  createdAt: string;
  createdBy: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  status: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hr-container">
      <div class="hr-header">
        <h2>👥 Gestión de Recursos Humanos</h2>
        <div class="header-buttons">
          <button (click)="switchTab('employees')" [class.active]="activeTab === 'employees'" class="btn-tab">
            Empleados
          </button>
          <button (click)="switchTab('attendance')" [class.active]="activeTab === 'attendance'" class="btn-tab">
            Asistencia
          </button>
        </div>
      </div>

      <!-- Empleados -->
      <div *ngIf="activeTab === 'employees'" class="hr-section">
        <div class="section-header">
          <h3>Nómina de Empleados</h3>
          <button (click)="openCreateEmployeeForm()" class="btn-primary">+ Nuevo Empleado</button>
        </div>

        <div class="form-container" *ngIf="showEmployeeForm">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre:</label>
              <input [(ngModel)]="employeeForm.firstName" type="text" placeholder="Nombre" />
            </div>
            <div class="form-group">
              <label>Apellido:</label>
              <input [(ngModel)]="employeeForm.lastName" type="text" placeholder="Apellido" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email:</label>
              <input [(ngModel)]="employeeForm.email" type="email" placeholder="email@example.com" />
            </div>
            <div class="form-group">
              <label>Puesto:</label>
              <input [(ngModel)]="employeeForm.position" type="text" placeholder="Puesto" />
            </div>
          </div>
          <div class="form-group">
            <label>Salario:</label>
            <input [(ngModel)]="employeeForm.salary" type="number" placeholder="Salario" />
          </div>
          <div class="form-actions">
            <button (click)="saveEmployee()" class="btn-success">Guardar</button>
            <button (click)="cancelEmployeeForm()" class="btn-secondary">Cancelar</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Puesto</th>
              <th>Salario</th>
              <th>Estado</th>
              <th>Fecha Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees" [class.inactive]="!emp.status">
              <td>{{ emp.firstName }} {{ emp.lastName }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.position }}</td>
              <td>{{ emp.salary?.toFixed(2) || 'N/A' }}</td>
              <td>
                <span [class]="emp.status ? 'status-active' : 'status-inactive'">
                  {{ emp.status ? '✓ Activo' : '✗ Inactivo' }}
                </span>
              </td>
              <td>{{ emp.createdAt | date:'short' }}</td>
              <td>
                <button (click)="deleteEmployee(emp.id)" class="btn-sm btn-delete" [disabled]="!emp.status">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Asistencia -->
      <div *ngIf="activeTab === 'attendance'" class="hr-section">
        <div class="section-header">
          <h3>Control de Asistencia</h3>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let att of attendance" [class.inactive]="!att.status">
              <td>{{ att.employeeId | slice:0:8 }}</td>
              <td>{{ att.date | date:'short' }}</td>
              <td>{{ att.timeIn }}</td>
              <td>{{ att.timeOut || '—' }}</td>
              <td>
                <span [class]="att.status ? 'status-active' : 'status-inactive'">
                  {{ att.status ? '✓' : '✗' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="attendance.length === 0" class="empty-state">
          No hay registros de asistencia
        </p>
      </div>
    </div>
  `,
  styles: [`
    .hr-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .hr-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ddd;
    }

    .header-buttons {
      display: flex;
      gap: 10px;
    }

    .btn-tab {
      padding: 8px 16px;
      background: #e9ecef;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-tab.active {
      background: #007bff;
      color: white;
      border-color: #0056b3;
    }

    .hr-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      margin: 0;
      color: #333;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .form-container {
      background: #f0f8ff;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #28a745;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .btn-success, .btn-secondary {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover {
      background: #218838;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    th {
      background: #f0f0f0;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background: #f9f9f9;
    }

    tr.inactive {
      opacity: 0.6;
      background: #f5f5f5;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .btn-sm {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
    }

    .btn-delete:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-sm:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 30px;
    }
  `]
})
export class HrComponent implements OnInit {
  employees: Employee[] = [];
  attendance: Attendance[] = [];
  activeTab: 'employees' | 'attendance' = 'employees';
  showEmployeeForm = false;
  employeeForm = { firstName: '', lastName: '', email: '', position: '', salary: 0 };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAttendance();
  }

  loadEmployees(): void {
    this.apiService.getEmployees().subscribe({
      next: (data: any) => {
        this.employees = data.filter((e: any) => e.status);
      },
      error: (err: any) => console.error(err)
    });
  }

  loadAttendance(): void {
    this.apiService.getAttendance().subscribe({
      next: (data: any) => {
        this.attendance = data.filter((a: any) => a.status);
      },
      error: (err: any) => console.error(err)
    });
  }

  switchTab(tab: 'employees' | 'attendance'): void {
    this.activeTab = tab;
  }

  openCreateEmployeeForm(): void {
    this.showEmployeeForm = true;
    this.employeeForm = { firstName: '', lastName: '', email: '', position: '', salary: 0 };
  }

  saveEmployee(): void {
    this.apiService.createEmployee(this.employeeForm).subscribe({
      next: () => {
        this.loadEmployees();
        this.cancelEmployeeForm();
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('¿Eliminar empleado?')) {
      this.apiService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (err: any) => console.error(err)
      });
    }
  }

  cancelEmployeeForm(): void {
    this.showEmployeeForm = false;
    this.employeeForm = { firstName: '', lastName: '', email: '', position: '', salary: 0 };
  }
}
