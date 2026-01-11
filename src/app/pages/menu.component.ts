import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService, MenuItem } from '../food.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <!-- Table Selection Section -->
      <div class="table-selection-section">
        <label class="table-label">🪑 เลือกโต๊ะของคุณ:</label>
        <select [(ngModel)]="selectedTable" class="table-select" (change)="onTableChange()">
          <option [ngValue]="null" disabled>-- กรุณาเลือกโต๊ะ --</option>
          <option *ngFor="let t of tables" [value]="t">โต๊ะที่ {{ t }}</option>
        </select>
      </div>

      <h2>🍽️ รายการอาหาร</h2>
      
      <div *ngIf="!selectedTable" class="warning-message">
        ⚠️ กรุณาเลือกโต๊ะก่อนสั่งอาหาร
      </div>

      <div class="menu-grid">
        <div *ngFor="let item of menuItems; let i = index" class="card menu-card" [style.animation-delay.ms]="i * 100">
          <div class="image-container">
            <img [src]="item.image" [alt]="item.name" class="menu-img">
            <div class="image-overlay">
              <span class="overlay-text">คลิกเพื่อสั่ง</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="price">{{ item.price }} <span class="currency">บาท</span></p>
            <button 
              (click)="addToCartWithNote(item)" 
              [disabled]="!selectedTable"
              class="btn btn-primary btn-add">
              <span class="btn-icon">➕</span> ใส่ตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <div class="modal-overlay" *ngIf="showNoteModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3 style="margin-top: 0; color: #d32f2f;">📝 เพิ่มหมายเหตุสำหรับ {{ selectedItem?.name }}</h3>
        <textarea 
          [(ngModel)]="itemNote" 
          class="note-textarea"
          placeholder="เช่น ไม่ใส่ผักชี, เผ็ดน้อย, เผ็ดมาก..."
          rows="4">
        </textarea>
        <div class="modal-buttons">
          <button (click)="confirmAddToCart()" class="btn btn-success">
            ✅ เพิ่มลงตะกร้า
          </button>
          <button (click)="closeModal()" class="btn-cancel">
            ❌ ยกเลิก
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-selection-section {
      background: white;
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 25px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .table-selection-section {
        padding: 15px;
        margin-bottom: 20px;
      }
    }

    .table-label {
      display: block;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .table-label {
        font-size: 1rem;
      }
    }

    .table-select {
      width: 100%;
      padding: 12px 15px;
      font-size: 1.1rem;
      border: 2px solid #ddd;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .table-select {
        padding: 10px 12px;
        font-size: 1rem;
      }
    }

    .table-select:focus {
      outline: none;
      border-color: #f4511e;
      box-shadow: 0 0 0 3px rgba(244, 81, 30, 0.1);
    }

    .warning-message {
      background: #fff3e0;
      color: #f57c00;
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      margin-bottom: 20px;
      border-left: 4px solid #ff9800;
    }

    @media (max-width: 768px) {
      .warning-message {
        padding: 12px;
        font-size: 0.95rem;
      }
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 25px;
    }

    @media (max-width: 992px) {
      .menu-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
    }

    @media (max-width: 480px) {
      .menu-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }
    
    .menu-card {
      animation: fadeIn 0.5s ease forwards;
      opacity: 0;
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    
    .image-container {
      position: relative;
      overflow: hidden;
      height: 200px;
    }

    @media (max-width: 768px) {
      .image-container {
        height: 150px;
      }
    }
    
    .menu-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .card:hover .menu-img {
      transform: scale(1.1);
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(198, 40, 40, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .card:hover .image-overlay {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .card:active .image-overlay {
        opacity: 1;
      }
    }
    
    .overlay-text {
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    @media (max-width: 768px) {
      .overlay-text {
        font-size: 1rem;
      }
    }
    
    .card-content {
      padding: 20px;
    }

    @media (max-width: 768px) {
      .card-content {
        padding: 15px;
      }
    }
    
    .item-name {
      color: #333;
      font-size: 1.3rem;
      margin: 10px 0;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .item-name {
        font-size: 1.1rem;
        margin: 8px 0;
      }
    }
    
    .price {
      color: #c62828;
      font-weight: bold;
      font-size: 1.5rem;
      margin: 15px 0;
    }

    @media (max-width: 768px) {
      .price {
        font-size: 1.3rem;
        margin: 10px 0;
      }
    }
    
    .currency {
      font-size: 1rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .currency {
        font-size: 0.9rem;
      }
    }
    
    .btn-add {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-add:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .btn-icon {
        font-size: 1rem;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
      padding: 20px;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 15px;
      }
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    }

    @media (max-width: 768px) {
      .modal-content {
        padding: 20px;
        border-radius: 12px;
      }

      .modal-content h3 {
        font-size: 1.2rem !important;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .note-textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 10px;
      font-size: 1rem;
      font-family: 'Sarabun', sans-serif;
      margin-bottom: 20px;
      resize: vertical;
      transition: border-color 0.3s ease;
    }

    @media (max-width: 768px) {
      .note-textarea {
        padding: 10px;
        font-size: 0.95rem;
      }
    }

    .note-textarea:focus {
      outline: none;
      border-color: #f4511e;
    }

    .modal-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .modal-buttons button {
      flex: 1;
      min-width: 120px;
    }

    @media (max-width: 480px) {
      .modal-buttons {
        flex-direction: column;
      }

      .modal-buttons button {
        width: 100%;
        min-width: auto;
      }
    }

    .btn-skip {
      background: #9e9e9e;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      font-weight: 600;
    }

    .btn-skip:hover {
      background: #757575;
      transform: translateY(-2px);
    }

    .btn-cancel {
      background: #f44336;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      font-weight: 600;
    }

    .btn-cancel:hover {
      background: #d32f2f;
      transform: translateY(-2px);
    }
  `]
})
export class MenuComponent {
  menuItems: MenuItem[] = [];
  tables: number[] = [];
  selectedTable: number | null = null;
  showNoteModal: boolean = false;
  selectedItem: MenuItem | null = null;
  itemNote: string = '';

  constructor(private foodService: FoodService) {
    this.menuItems = this.foodService.getMenu();
    this.tables = this.foodService.tables;
    this.selectedTable = this.foodService.getSelectedTable();
  }

  onTableChange() {
    if (this.selectedTable) {
      this.foodService.setSelectedTable(this.selectedTable);
    }
  }

  addToCartWithNote(item: MenuItem) {
    if (!this.selectedTable) return;
    this.selectedItem = item;
    this.itemNote = '';
    this.showNoteModal = true;
  }

  confirmAddToCart() {
    if (this.selectedItem) {
      this.foodService.addToCart(this.selectedItem, this.itemNote || undefined);
      const note = this.itemNote ? ` (${this.itemNote})` : '';
      alert(`เพิ่ม "${this.selectedItem.name}"${note} ลงตะกร้าแล้ว`);
      this.closeModal();
    }
  }

  closeModal() {
    this.showNoteModal = false;
    this.selectedItem = null;
    this.itemNote = '';
  }
}