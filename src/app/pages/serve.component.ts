import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService, Order } from '../food.service';

@Component({
  selector: 'app-serve',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>🍳 สถานะการทำอาหาร</h2>

      <div *ngIf="orders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <p>ยังไม่มีออเดอร์</p>
      </div>

      <div class="orders-grid">
        <div *ngFor="let order of orders" 
             class="order-card" 
             [class.order-served]="order.status === 'served'">
          
          <div class="order-header">
            <div class="order-info">
              <h3 class="table-number">🪑 โต๊ะที่ {{ order.tableId }}</h3>
              <small class="order-time">⏰ {{ order.timestamp | date:'shortTime' }}</small>
            </div>
            <div class="status-badge" [ngClass]="{
              'status-preparing': order.status === 'preparing',
              'status-served': order.status === 'served'
            }">
              <span *ngIf="order.status === 'preparing'">🍳 กำลังทำอาหาร</span>
              <span *ngIf="order.status === 'served'">✅ เสิร์ฟแล้ว</span>
            </div>
          </div>

          <div class="order-items">
            <div *ngFor="let item of order.items" class="item-row">
              <div class="item-info-col">
                <span class="item-name">{{ item.name }}</span>
                <div *ngIf="item.note" class="item-note-inline">
                  📝 {{ item.note }}
                </div>
              </div>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">{{ item.price * item.quantity }} ฿</span>
            </div>
          </div>

          <div *ngIf="order.note" class="order-note">
            <strong>📝 หมายเหตุ:</strong> {{ order.note }}
          </div>

          <div class="order-footer">
            <div class="total-price">
              <strong>รวมทั้งสิ้น:</strong>
              <span class="price-value">{{ order.totalPrice }} บาท</span>
            </div>
            
            <div class="payment-status" *ngIf="order.isPaid">
              <span class="paid-badge">💰 ชำระเงินแล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .order-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      border-left: 5px solid #ff5722;
    }

    .order-card:hover {
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      transform: translateY(-3px);
    }

    .order-served {
      opacity: 0.85;
      border-left-color: #4caf50;
    }

    .order-paid {
      opacity: 0.7;
      border-left-color: #2196f3;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 2px dashed #eee;
    }

    .table-number {
      margin: 0 0 5px 0;
      color: #d32f2f;
      font-size: 1.3rem;
    }

    .order-time {
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-preparing {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-served {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .order-items {
      margin-bottom: 15px;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr auto auto;
      gap: 10px;
      padding: 8px 0;
      align-items: center;
    }

    .item-info-col {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-name {
      color: #333;
      font-weight: 500;
    }

    .item-note-inline {
      background: #fff9c4;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #666;
      border-left: 2px solid #fbc02d;
    }

    .item-qty {
      color: #666;
      font-size: 0.9rem;
    }

    .item-price {
      color: #d32f2f;
      font-weight: 600;
      text-align: right;
    }

    .order-note {
      background: #fff9c4;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 0.95rem;
      border-left: 3px solid #fbc02d;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 2px solid #eee;
      gap: 15px;
      flex-wrap: wrap;
    }

    .total-price {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .price-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #d32f2f;
    }

    .payment-status {
      display: flex;
      gap: 10px;
    }

    .paid-badge {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
    }
  `]
})
export class ServeComponent {
  orders: Order[] = [];

  constructor(private foodService: FoodService) {
    this.refreshOrders();
  }

  refreshOrders() {
    this.orders = this.foodService.getOrders();
  }
}