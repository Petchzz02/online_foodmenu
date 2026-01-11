import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FoodService, CartItem } from '../food.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>🛒 ตะกร้าของฉัน</h2>
        <div *ngIf="selectedTable" class="table-badge-header">
          🪑 โต๊ะที่ {{ selectedTable }}
        </div>
      </div>
      
      <div *ngIf="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p class="empty-text">ตะกร้าว่างเปล่า</p>
        <p class="empty-subtext">เลือกเมนูอาหารที่คุณชอบเพื่อเริ่มสั่งอาหาร</p>
        <button (click)="goToMenu()" class="btn btn-primary btn-go-menu">
          🍽️ ไปเลือกเมนู
        </button>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items-section">
          <div class="section-title">
            <span>รายการอาหาร</span>
            <span class="item-count">{{ cartItems.length }} รายการ</span>
          </div>
          
          <div class="cart-list">
            <div *ngFor="let item of cartItems; let i = index" class="cart-item" [style.animation-delay.ms]="i * 50">
              <div class="item-header">
                <div class="item-name-section">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price-unit">{{ item.price }} บาท/ชิ้น</span>
                </div>
                <button (click)="removeItem(item.id)" class="btn-remove-icon" title="ลบรายการ">
                  🗑️
                </button>
              </div>

              <div *ngIf="item.note" class="item-note">
                <span class="note-icon">📝</span>
                <span class="note-text">{{ item.note }}</span>
              </div>

              <div class="item-footer">
                <div class="quantity-controls">
                  <button (click)="decreaseQuantity(item.id)" class="btn-quantity" [disabled]="item.quantity <= 1">
                    <span>−</span>
                  </button>
                  <div class="quantity-display">
                    <span class="quantity-number">{{ item.quantity }}</span>
                  </div>
                  <button (click)="increaseQuantity(item.id)" class="btn-quantity">
                    <span>+</span>
                  </button>
                </div>

                <div class="item-actions">
                  <button (click)="editNote(i)" class="btn-action">
                    <span class="action-icon">✏️</span>
                    <span class="action-text">หมายเหตุ</span>
                  </button>
                </div>

                <div class="item-total-price">
                  <span class="total-amount">{{ item.price * item.quantity }}</span>
                  <span class="total-currency">บาท</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-header">
            <span class="summary-icon">📋</span>
            <span class="summary-title">สรุปรายการ</span>
          </div>

          <div class="summary-details">
            <div class="summary-row">
              <span class="summary-label">จำนวนเมนู</span>
              <span class="summary-value">{{ getTotalItems() }} รายการ</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">ราคารวม</span>
              <span class="summary-value">{{ getTotal() }} บาท</span>
            </div>
          </div>

          <div class="summary-total">
            <span class="total-label">ยอดรวมทั้งสิ้น</span>
            <div class="total-value">
              <span class="total-number">{{ getTotal() }}</span>
              <span class="total-currency">บาท</span>
            </div>
          </div>

          <button (click)="goToOrder()" class="btn btn-success btn-confirm">
            <span class="btn-icon">✅</span>
            <span>ยืนยันสั่งอาหาร</span>
          </button>

          <button (click)="goToMenu()" class="btn-continue">
            ← กลับไปเลือกเมนูเพิ่ม
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 20px;
      }
    }

    .page-header h2 {
      margin: 0;
    }

    .table-badge-header {
      background: linear-gradient(135deg, #f4511e 0%, #ff6f00 100%);
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 600;
      font-size: 1.1rem;
      box-shadow: 0 3px 8px rgba(244, 81, 30, 0.3);
    }

    @media (max-width: 768px) {
      .table-badge-header {
        padding: 8px 16px;
        font-size: 1rem;
      }
    }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 80px 30px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    @media (max-width: 768px) {
      .empty-cart {
        padding: 60px 20px;
      }
    }
    
    .empty-icon {
      font-size: 6rem;
      margin-bottom: 25px;
      opacity: 0.4;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    @media (max-width: 768px) {
      .empty-icon {
        font-size: 4rem;
      }
    }
    
    .empty-text {
      font-size: 1.8rem;
      color: #333;
      margin: 15px 0;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .empty-text {
        font-size: 1.4rem;
      }
    }
    
    .empty-subtext {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .empty-subtext {
        font-size: 1rem;
        margin-bottom: 25px;
      }
    }

    .btn-go-menu {
      padding: 14px 30px;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .btn-go-menu {
        padding: 12px 24px;
        font-size: 1rem;
      }
    }

    /* Cart Content Layout */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
      align-items: start;
    }

    @media (max-width: 992px) {
      .cart-content {
        grid-template-columns: 1fr;
        gap: 25px;
      }
    }

    /* Cart Items Section */
    .cart-items-section {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    @media (max-width: 768px) {
      .cart-items-section {
        padding: 20px;
      }
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 1.1rem;
      }
    }

    .item-count {
      background: #f5f5f5;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .cart-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .cart-item {
      background: #fafafa;
      border-radius: 12px;
      padding: 18px;
      transition: all 0.3s ease;
      animation: slideIn 0.4s ease forwards;
      opacity: 0;
      border: 2px solid transparent;
    }

    @media (max-width: 768px) {
      .cart-item {
        padding: 15px;
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .cart-item:hover {
      border-color: #f4511e;
      box-shadow: 0 4px 12px rgba(244, 81, 30, 0.15);
    }

    /* Item Header */
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .item-name-section {
      flex: 1;
    }

    .item-name {
      display: block;
      font-size: 1.15rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    @media (max-width: 768px) {
      .item-name {
        font-size: 1.05rem;
      }
    }

    .item-price-unit {
      font-size: 0.9rem;
      color: #666;
    }

    .btn-remove-icon {
      background: #fff;
      border: 2px solid #f44336;
      color: #f44336;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove-icon:hover {
      background: #f44336;
      transform: scale(1.1);
    }

    .btn-remove-icon:hover {
      filter: brightness(1.2);
    }

    /* Item Note */
    .item-note {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff9c4;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 3px solid #fbc02d;
    }

    @media (max-width: 768px) {
      .item-note {
        padding: 6px 10px;
      }
    }

    .note-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .note-text {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .note-text {
        font-size: 0.9rem;
      }
    }

    /* Item Footer */
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .item-footer {
        gap: 10px;
      }
    }

    /* Quantity Controls */
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 5px;
      border-radius: 25px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .btn-quantity {
      background: linear-gradient(135deg, #f4511e 0%, #ff6f00 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .btn-quantity {
        width: 32px;
        height: 32px;
        font-size: 1.1rem;
      }
    }

    .btn-quantity:hover:not(:disabled) {
      transform: scale(1.15);
      box-shadow: 0 3px 10px rgba(244, 81, 30, 0.4);
    }

    .btn-quantity:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .quantity-display {
      min-width: 45px;
      text-align: center;
    }

    .quantity-number {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
    }

    /* Item Actions */
    .item-actions {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      background: white;
      border: 2px solid #2196f3;
      color: #2196f3;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    @media (max-width: 768px) {
      .btn-action {
        padding: 6px 12px;
        font-size: 0.85rem;
      }
    }

    .btn-action:hover {
      background: #2196f3;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(33, 150, 243, 0.3);
    }

    .action-icon {
      font-size: 1rem;
    }

    /* Item Total Price */
    .item-total-price {
      background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: baseline;
      gap: 5px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(198, 40, 40, 0.3);
    }

    @media (max-width: 768px) {
      .item-total-price {
        width: 100%;
        justify-content: center;
        padding: 10px;
      }
    }

    .total-amount {
      font-size: 1.3rem;
    }

    .total-currency {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    /* Order Summary */
    .order-summary {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      position: sticky;
      top: 20px;
    }

    @media (max-width: 992px) {
      .order-summary {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .order-summary {
        padding: 20px;
      }
    }

    .summary-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }

    .summary-icon {
      font-size: 1.5rem;
    }

    .summary-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #333;
    }

    @media (max-width: 768px) {
      .summary-title {
        font-size: 1.2rem;
      }
    }

    .summary-details {
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .summary-label {
      font-size: 1rem;
      color: #666;
    }

    .summary-value {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .summary-total {
      background: linear-gradient(135deg, #fef5e7 0%, #fff3e0 100%);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 2px solid #ff9800;
    }

    @media (max-width: 768px) {
      .summary-total {
        padding: 15px;
      }
    }

    .total-label {
      display: block;
      font-size: 0.95rem;
      color: #666;
      margin-bottom: 8px;
    }

    .total-value {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .total-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: #c62828;
      line-height: 1;
    }

    @media (max-width: 768px) {
      .total-number {
        font-size: 2rem;
      }
    }

    .total-currency {
      font-size: 1.2rem;
      color: #666;
      font-weight: 600;
    }

    .btn-confirm {
      width: 100%;
      padding: 16px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(67, 160, 71, 0.3);
    }

    @media (max-width: 768px) {
      .btn-confirm {
        padding: 14px;
        font-size: 1.1rem;
      }
    }

    .btn-confirm:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(67, 160, 71, 0.4);
    }

    .btn-continue {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: 2px solid #ddd;
      color: #666;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .btn-continue {
        padding: 10px;
        font-size: 0.95rem;
      }
    }

    .btn-continue:hover {
      border-color: #f4511e;
      color: #f4511e;
      background: #fff5f2;
    }
  `]
})
export class CartComponent {
  cartItems: CartItem[] = [];
  selectedTable: number | null = null;

  constructor(private foodService: FoodService, private router: Router) {
    this.cartItems = this.foodService.getCart();
    this.selectedTable = this.foodService.getSelectedTable();
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(itemId: number) {
    this.foodService.updateQuantity(itemId, 1);
    this.cartItems = this.foodService.getCart();
  }

  decreaseQuantity(itemId: number) {
    this.foodService.updateQuantity(itemId, -1);
    this.cartItems = this.foodService.getCart();
  }

  removeItem(itemId: number) {
    if (confirm('ต้องการลบรายการนี้หรือไม่?')) {
      this.foodService.removeFromCart(itemId);
      this.cartItems = this.foodService.getCart();
    }
  }

  editNote(index: number) {
    const currentNote = this.cartItems[index].note || '';
    const newNote = prompt(`หมายเหตุสำหรับ ${this.cartItems[index].name}:`, currentNote);
    if (newNote !== null) {
      this.foodService.updateItemNote(index, newNote);
      this.cartItems = this.foodService.getCart();
    }
  }

  goToOrder() {
    if (this.cartItems.length === 0) {
      alert('ตะกร้าว่างเปล่า กรุณาเลือกเมนูอาหารก่อน');
      return;
    }
    
    if (confirm('ยืนยันการสั่งอาหารหรือไม่?')) {
      this.foodService.placeOrder();
      alert('✅ สั่งอาหารเรียบร้อยแล้ว');
      this.router.navigate(['/serve']);
    }
  }

  goToMenu() {
    this.router.navigate(['/']);
  }
}