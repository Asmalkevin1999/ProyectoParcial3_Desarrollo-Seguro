import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  quantity: number;
  status: boolean;
  createdAt: string;
  createdBy: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-container">
      <div class="inventory-header">
        <h2>📦 Gestión de Inventario</h2>
        <div class="header-buttons">
          <button (click)="switchTab('products')" [class.active]="activeTab === 'products'" class="btn-tab">
            Productos
          </button>
          <button (click)="switchTab('categories')" [class.active]="activeTab === 'categories'" class="btn-tab">
            Categorías
          </button>
        </div>
      </div>

      <!-- Productos -->
      <div *ngIf="activeTab === 'products'" class="inventory-section">
        <div class="section-header">
          <h3>Productos en Stock</h3>
          <button (click)="openCreateProductForm()" class="btn-primary">+ Nuevo Producto</button>
        </div>

        <div class="form-container" *ngIf="showProductForm">
          <div class="form-group">
            <label>Nombre:</label>
            <input [(ngModel)]="productForm.name" type="text" placeholder="Nombre del producto" />
          </div>
          <div class="form-group">
            <label>Precio:</label>
            <input [(ngModel)]="productForm.price" type="number" placeholder="Precio" />
          </div>
          <div class="form-group">
            <label>Cantidad:</label>
            <input [(ngModel)]="productForm.quantity" type="number" placeholder="Cantidad" />
          </div>
          <div class="form-actions">
            <button (click)="saveProduct()" class="btn-success">Guardar</button>
            <button (click)="cancelProductForm()" class="btn-secondary">Cancelar</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products" [class.inactive]="!product.status">
              <td>{{ product.name }}</td>
              <td>{{ product.price.toFixed(2) }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <span [class]="product.status ? 'status-active' : 'status-inactive'">
                  {{ product.status ? '✓' : '✗' }}
                </span>
              </td>
              <td>{{ product.createdAt | date:'short' }}</td>
              <td>
                <button (click)="deleteProduct(product.id)" class="btn-sm btn-delete" [disabled]="!product.status">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Categorías -->
      <div *ngIf="activeTab === 'categories'" class="inventory-section">
        <div class="section-header">
          <h3>Categorías</h3>
          <button (click)="openCreateCategoryForm()" class="btn-primary">+ Nueva Categoría</button>
        </div>

        <div class="form-container" *ngIf="showCategoryForm">
          <div class="form-group">
            <label>Nombre:</label>
            <input [(ngModel)]="categoryForm.name" type="text" placeholder="Nombre de categoría" />
          </div>
          <div class="form-actions">
            <button (click)="saveCategory()" class="btn-success">Guardar</button>
            <button (click)="cancelCategoryForm()" class="btn-secondary">Cancelar</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories" [class.inactive]="!category.status">
              <td>{{ category.name }}</td>
              <td>
                <span [class]="category.status ? 'status-active' : 'status-inactive'">
                  {{ category.status ? '✓ Activo' : '✗ Inactivo' }}
                </span>
              </td>
              <td>{{ category.createdAt | date:'short' }}</td>
              <td>
                <button (click)="deleteCategory(category.id)" class="btn-sm btn-delete" [disabled]="!category.status">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .inventory-header {
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

    .inventory-section {
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
  `]
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  activeTab: 'products' | 'categories' = 'products';
  showProductForm = false;
  showCategoryForm = false;
  productForm = { name: '', price: 0, quantity: 0 };
  categoryForm = { name: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.filter((p: any) => p.status);
      },
      error: (err: any) => console.error(err)
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data.filter((c: any) => c.status);
      },
      error: (err: any) => console.error(err)
    });
  }

  switchTab(tab: 'products' | 'categories'): void {
    this.activeTab = tab;
  }

  openCreateProductForm(): void {
    this.showProductForm = true;
    this.productForm = { name: '', price: 0, quantity: 0 };
  }

  saveProduct(): void {
    this.apiService.createProduct(this.productForm).subscribe({
      next: () => {
        this.loadProducts();
        this.cancelProductForm();
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteProduct(id: string): void {
    if (confirm('¿Eliminar producto?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => console.error(err)
      });
    }
  }

  cancelProductForm(): void {
    this.showProductForm = false;
    this.productForm = { name: '', price: 0, quantity: 0 };
  }

  openCreateCategoryForm(): void {
    this.showCategoryForm = true;
    this.categoryForm = { name: '' };
  }

  saveCategory(): void {
    this.apiService.createCategory(this.categoryForm).subscribe({
      next: () => {
        this.loadCategories();
        this.cancelCategoryForm();
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteCategory(id: string): void {
    if (confirm('¿Eliminar categoría?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err: any) => console.error(err)
      });
    }
  }

  cancelCategoryForm(): void {
    this.showCategoryForm = false;
    this.categoryForm = { name: '' };
  }
}
