import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';

interface Sale {
  id: string;
  customerName: string;
  total: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  details: any[];
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-container">
      <div class="sales-header">
        <h2>📊 Gestión de Ventas</h2>
        <button (click)="openCreateForm()" class="btn-primary">
          + Nueva Venta
        </button>
      </div>

      <div class="sales-form" *ngIf="showForm">
        <div class="form-group">
          <label>Cliente:</label>
          <input 
            [(ngModel)]="formData.customerName" 
            type="text" 
            placeholder="Nombre del cliente"
          />
        </div>
        <div class="form-actions">
          <button (click)="saveSale()" class="btn-success">Guardar</button>
          <button (click)="cancelForm()" class="btn-secondary">Cancelar</button>
        </div>
      </div>

      <div class="sales-table">
        <h3>Ventas Registradas (Activas)</h3>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Creado Por</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sale of sales" [class.inactive]="!sale.status">
              <td>{{ sale.customerName }}</td>
              <td>{{ sale.total.toFixed(2) }}</td>
              <td>
                <span [class]="sale.status ? 'status-active' : 'status-inactive'">
                  {{ sale.status ? '✓ Activo' : '✗ Eliminado' }}
                </span>
              </td>
              <td>{{ sale.createdBy | slice:0:8 }}</td>
              <td>{{ sale.createdAt | date:'short' }}</td>
              <td>
                <button 
                  (click)="editSale(sale)" 
                  class="btn-sm btn-edit"
                  [disabled]="!sale.status"
                >
                  Editar
                </button>
                <button 
                  (click)="deleteSale(sale.id)" 
                  class="btn-sm btn-delete"
                  [disabled]="!sale.status"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="sales.length === 0" class="empty-state">
          No hay ventas registradas
        </p>
      </div>

      <div class="audit-info">
        <h3>ℹ️ Información de Auditoría</h3>
        <p>Las ventas se marcan como eliminadas (soft delete) para mantener historial de auditoría.</p>
        <p>Campos de auditoría: createdBy, updatedBy, createdAt, updatedAt</p>
      </div>
    </div>
  `,
  styles: [`
    .sales-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .sales-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ddd;
    }

    .sales-header h2 {
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

    .sales-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #28a745;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .btn-success, .btn-secondary {
      padding: 10px 20px;
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

    .sales-table {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .sales-table h3 {
      margin-top: 0;
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f0f0f0;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      color: #555;
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
      font-weight: 500;
    }

    .btn-sm {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      margin-right: 5px;
    }

    .btn-edit {
      background: #17a2b8;
      color: white;
    }

    .btn-edit:hover:not(:disabled) {
      background: #138496;
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

    .audit-info {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 15px;
      border-radius: 4px;
      color: #0066cc;
    }

    .audit-info h3 {
      margin-top: 0;
    }

    .audit-info p {
      margin: 5px 0;
      font-size: 14px;
    }
  `]
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  showForm = false;
  formData = { customerName: '' };
  editingId: string | null = null;
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.apiService.getSales().subscribe({
      next: (data: any) => {
        this.sales = data.filter((s: any) => s.status);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar ventas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openCreateForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.formData = { customerName: '' };
  }

  saveSale(): void {
    if (!this.formData.customerName.trim()) {
      alert('El nombre del cliente es requerido');
      return;
    }

    const action = this.editingId
      ? this.apiService.updateSale(this.editingId, this.formData)
      : this.apiService.createSale({ ...this.formData, details: [] });

    action.subscribe({
      next: () => {
        this.loadSales();
        this.cancelForm();
      },
      error: (err: any) => {
        this.error = 'Error al guardar venta';
        console.error(err);
      }
    });
  }

  editSale(sale: Sale): void {
    this.editingId = sale.id;
    this.formData = { customerName: sale.customerName };
    this.showForm = true;
  }

  deleteSale(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta venta?')) {
      this.apiService.deleteSale(id).subscribe({
        next: () => {
          this.loadSales();
        },
        error: (err: any) => {
          this.error = 'Error al eliminar venta';
          console.error(err);
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.formData = { customerName: '' };
  }
}
