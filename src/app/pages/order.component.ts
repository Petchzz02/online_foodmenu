import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width: 700px;">
      <div class="order-card">
        <h2 style="text-align: center; color: #d32f2f; margin-bottom: 25px;">📋 ยืนยันออเดอร์</h2>
        
        <div class="table-info" *ngIf="selectedTable">
          <span class="table-icon">🪑</span>
          <span class="table-text">โต๊ะที่ {{ selectedTable }}</span>
        </div>

        <div class="order-items" *ngIf="cartItems.length > 0">
          <h4 class="section-title">รายการอาหารที่สั่ง:</h4>
          <div *ngFor="let item of cartItems; let i = index" class="order-item">
            <div class="order-item-header">
              <span class="order-item-name">{{ item.name }} x{{ item.quantity }}</span>
              <span class="order-item-price">{{ item.price * item.quantity }} ฿</span>
            </div>
            <div *ngIf="item.note" class="order-item-note">
              📝 {{ item.note }}
            </div>
            <button (click)="editItemNote(i)" class="btn-edit-small">✏️ แก้ไขหมายเหตุ</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">📝 หมายเหตุเพิ่มเติมสำหรับออเดอร์ทั้งหมด (ถ้ามี):</label>
          <textarea 
            [(ngModel)]="orderNote" 
            class="form-textarea" 
            placeholder="เช่น ขอช้อนส้อมเพิ่ม, ขอน้ำแข็งเยอะๆ ฯลฯ"
            rows="3">
          </textarea>
        </div>

        <button 
          [disabled]="!selectedTable" 
          (click)="confirmOrder()" 
          class="btn btn-success btn-confirm">
          <span style="font-size: 1.3rem;">✅</span> ยืนยันการสั่งอาหาร
        </button>

        <p class="note-text" *ngIf="!selectedTable">
          ⚠️ กรุณาเลือกโต๊ะที่หน้าเมนูก่อน
        </p>
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .table-info {
      background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 600;
      box-shadow: 0 4px 8px rgba(255, 87, 34, 0.3);
    }

    .table-icon {
      font-size: 1.8rem;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-label {
      display: block;
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 1.1rem;
      color: #333;
    }

    .form-textarea {
      width: 100%;
      padding: 12px 15px;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 10px;
      font-family: 'Sarabun', sans-serif;
      resize: vertical;
      transition: all 0.3s ease;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #ff5722;
      box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
    }

    .btn-confirm {
      width: 100%;
      padding: 18px;
      font-size: 1.3rem;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-confirm:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .note-text {
      text-align: center;
      color: #f57c00;
      margin-top: 15px;
      font-weight: 600;
    }

    .section-title {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.2rem;
    }

    .order-items {
      margin-bottom: 25px;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 12px;
    }

    .order-item {
      background: white;
      padding: 15px;
      margin-bottom: 12px;
      border-radius: 10px;
      border-left: 4px solid #ff5722;
    }

    .order-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .order-item-name {
      font-weight: 600;
      color: #333;
    }

    .order-item-price {
      color: #d32f2f;
      font-weight: bold;
    }

    .order-item-note {
      background: #fff9c4;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 8px;
      border-left: 3px solid #fbc02d;
    }

    .btn-edit-small {
      background: #2196f3;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-edit-small:hover {
      background: #1976d2;
      transform: translateY(-1px);
    }
  `]
})
export class OrderComponent {
  selectedTable: number | null = null;
  orderNote: string = '';
  cartItems: any[] = [];

  constructor(private foodService: FoodService, private router: Router) {
    this.selectedTable = this.foodService.getSelectedTable();
    this.cartItems = this.foodService.getCart();
  }

  editItemNote(index: number) {
    const item = this.cartItems[index];
    const currentNote = item.note || '';
    const newNote = prompt(`แก้ไขหมายเหตุสำหรับ ${item.name}:`, currentNote);
    if (newNote !== null) {
      this.foodService.updateItemNote(index, newNote);
      this.cartItems = this.foodService.getCart();
    }
  }

  confirmOrder() {
    if (this.selectedTable) {
      this.foodService.placeOrder(this.orderNote || undefined);
      alert('✅ สั่งอาหารเรียบร้อย! พนักงานกำลังเตรียมอาหาร');
      this.router.navigate(['/']); // กลับหน้าแรก
    }
  }
}