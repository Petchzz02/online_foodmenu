import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FoodService, Order } from '../food.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="payment-card">
        <h2 style="text-align: center; color: #d32f2f; margin-bottom: 30px;">💰 ชำระเงิน</h2>
        
        <div *ngIf="!selectedTable" class="warning-section">
          <p>⚠️ กรุณาเลือกโต๊ะที่หน้าเมนูก่อนชำระเงิน</p>
          <button (click)="goToMenu()" class="btn btn-primary">ไปหน้าเมนู</button>
        </div>

        <div *ngIf="selectedTable && unpaidOrders.length === 0" class="empty-section">
          <div class="empty-icon">✅</div>
          <p>ไม่มีรายการค้างชำระสำหรับโต๊ะที่ {{ selectedTable }}</p>
          <button (click)="goToMenu()" class="btn btn-primary">กลับหน้าเมนู</button>
        </div>

        <div *ngIf="selectedTable && unpaidOrders.length > 0">
          <div class="table-header">
            <h3>🪑 โต๊ะที่ {{ selectedTable }}</h3>
            <p class="subtitle">รายการค้างชำระทั้งหมด</p>
          </div>

          <div class="orders-list">
            <div *ngFor="let order of unpaidOrders; let i = index" class="order-section">
              <div class="order-title">
                <span>ออเดอร์ที่ {{ i + 1 }}</span>
                <small>{{ order.timestamp | date:'shortTime' }}</small>
              </div>

              <div class="items-list">
                <div *ngFor="let item of order.items" class="item-row">
                  <div class="item-info-col">
                    <span class="item-name">{{ item.name }}</span>
                    <div *ngIf="item.note" class="item-note-badge">
                      📝 {{ item.note }}
                    </div>
                  </div>
                  <span class="item-detail">{{ item.quantity }} x {{ item.price }} ฿</span>
                  <span class="item-total">{{ item.price * item.quantity }} ฿</span>
                </div>
              </div>

              <div *ngIf="order.note" class="note-section">
                <strong>📝 หมายเหตุ:</strong> {{ order.note }}
              </div>

              <div class="order-subtotal">
                <strong>ยอดรวมออเดอร์นี้:</strong>
                <span>{{ order.totalPrice }} บาท</span>
              </div>
            </div>
          </div>

          <div class="total-section">
            <div class="grand-total">
              <span class="total-label">ยอดรวมทั้งหมด:</span>
              <span class="total-amount">{{ calculateGrandTotal() }} บาท</span>
            </div>
          </div>

          <div class="payment-methods">
            <h4>เลือกวิธีชำระเงิน:</h4>
            <div class="methods-grid">
              <button (click)="processPayment('cash')" class="payment-btn">
                <span class="payment-icon">💵</span>
                <span class="payment-text">เงินสด</span>
              </button>
              <button (click)="processPayment('promptpay')" class="payment-btn">
                <span class="payment-icon">📱</span>
                <span class="payment-text">พร้อมเพย์</span>
              </button>
              <button (click)="processPayment('card')" class="payment-btn">
                <span class="payment-icon">💳</span>
                <span class="payment-text">บัตรเครดิต</span>
              </button>
              <button (click)="processPayment('transfer')" class="payment-btn">
                <span class="payment-icon">🏦</span>
                <span class="payment-text">โอนเงิน</span>
              </button>
            </div>
          </div>

          <button (click)="goBack()" class="btn-back">
            ← กลับ
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .warning-section, .empty-section {
      text-align: center;
      padding: 60px 20px;
    }

    .warning-section p, .empty-section p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 20px;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .table-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #ff5722;
      margin-bottom: 25px;
    }

    .table-header h3 {
      margin: 0 0 10px 0;
      color: #d32f2f;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #666;
      margin: 0;
      font-size: 1.1rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 25px;
    }

    .order-section {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #ff5722;
    }

    .order-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px dashed #ddd;
      font-weight: 600;
      color: #333;
    }

    .order-title small {
      color: #666;
      font-weight: normal;
    }

    .items-list {
      margin-bottom: 15px;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 15px;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
      align-items: start;
    }

    .item-info-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
    }

    .item-note-badge {
      background: #fff9c4;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #666;
      border-left: 3px solid #fbc02d;
    }

    .item-detail {
      color: #666;
      font-size: 0.95rem;
    }

    .item-total {
      color: #d32f2f;
      font-weight: 600;
      text-align: right;
    }

    .note-section {
      background: #fff9c4;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 3px solid #fbc02d;
      font-size: 0.95rem;
    }

    .order-subtotal {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      color: #666;
      font-size: 1.1rem;
    }

    .total-section {
      background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
    }

    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .total-label {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .total-amount {
      font-size: 2.2rem;
      font-weight: bold;
    }

    .payment-methods h4 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.2rem;
    }

    .methods-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }

    .payment-btn {
      background: white;
      border: 2px solid #ddd;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .payment-btn:hover {
      border-color: #ff5722;
      background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%);
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(255, 87, 34, 0.2);
    }

    .payment-icon {
      font-size: 2.5rem;
    }

    .payment-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .btn-back {
      background: #757575;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 12px 30px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .btn-back:hover {
      background: #616161;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    @media (max-width: 600px) {
      .methods-grid {
        grid-template-columns: 1fr;
      }

      .item-row {
        grid-template-columns: 1fr;
        gap: 5px;
      }

      .item-total {
        text-align: left;
      }
    }
  `]
})
export class PaymentComponent implements OnInit {
  unpaidOrders: Order[] = [];
  selectedTable: number | null = null;

  constructor(
    private router: Router,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.selectedTable = this.foodService.getSelectedTable();
    if (this.selectedTable) {
      this.unpaidOrders = this.foodService.getUnpaidOrdersByTable(this.selectedTable);
    }
  }

  calculateGrandTotal(): number {
    return this.unpaidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  }

  processPayment(method: string) {
    const methodNames: { [key: string]: string } = {
      'cash': 'เงินสด',
      'promptpay': 'พร้อมเพย์',
      'card': 'บัตรเครดิต',
      'transfer': 'โอนเงิน'
    };

    const total = this.calculateGrandTotal();
    if (confirm(`ยืนยันการชำระเงินด้วย ${methodNames[method]} จำนวน ${total} บาท?`)) {
      // Mark all orders as paid
      this.unpaidOrders.forEach(order => {
        this.foodService.markAsPaid(order.orderId);
      });
      alert('✅ ชำระเงินเรียบร้อยแล้ว! ขอบคุณที่ใช้บริการ');
      this.router.navigate(['/']);
    }
  }

  goToMenu() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
