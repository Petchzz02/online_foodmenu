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
      <h2>🛒 ตะกร้าของฉัน</h2>
      
      <div *ngIf="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p class="empty-text">ยังไม่มีสินค้าในตะกร้า</p>
        <p class="empty-subtext">เลือกเมนูอาหารที่คุณชอบได้เลย!</p>
      </div>

      <div class="cart-list" *ngIf="cartItems.length > 0">
        <div *ngFor="let item of cartItems; let i = index" class="cart-item" [style.animation-delay.ms]="i * 100">
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div *ngIf="item.note" class="item-note">
              📝 {{ item.note }}
            </div>
            <div class="item-controls">
              <button (click)="decreaseQuantity(item.id)" class="btn-quantity">➖</button>
              <span class="item-quantity">{{ item.quantity }}</span>
              <button (click)="increaseQuantity(item.id)" class="btn-quantity">➕</button>
            </div>
          </div>
          <div class="item-right">
            <div class="item-price">
              <span class="price-amount">{{ item.price * item.quantity }}</span>
              <span class="price-currency">บาท</span>
            </div>
            <button (click)="editNote(i)" class="btn-edit-note">✏️ แก้ไขหมายเหตุ</button>
            <button (click)="removeItem(item.id)" class="btn-remove">🗑️ ลบ</button>
          </div>
        </div>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-summary">
        <div class="summary-card">
          <div class="total-row">
            <span class="total-label">รวมทั้งสิ้น:</span>
            <span class="total-amount">{{ getTotal() }} <span class="currency">บาท</span></span>
          </div>
          <button (click)="goToOrder()" class="btn btn-success btn-order">
            <span class="btn-icon">🍴</span> ไปหน้าสั่งอาหาร
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-cart {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .empty-cart {
        padding: 60px 15px;
      }
    }
    
    .empty-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .empty-icon {
        font-size: 3.5rem;
      }
    }
    
    .empty-text {
      font-size: 1.5rem;
      color: #666;
      margin: 10px 0;
    }

    @media (max-width: 768px) {
      .empty-text {
        font-size: 1.2rem;
      }
    }
    
    .empty-subtext {
      color: #999;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .empty-subtext {
        font-size: 1rem;
      }
    }
    
    .cart-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    @media (max-width: 768px) {
      .cart-list {
        gap: 12px;
      }
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease forwards;
      opacity: 0;
    }

    @media (max-width: 768px) {
      .cart-item {
        flex-direction: column;
        align-items: flex-start;
        padding: 15px;
        gap: 15px;
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .cart-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    
    .item-info {
      flex: 1;
    }
    
    .item-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .item-note {
      background: #fff9c4;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 8px;
      border-left: 3px solid #fbc02d;
    }
    
    .item-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .btn-quantity {
      background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-quantity:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(255, 87, 34, 0.4);
    }
    
    .item-quantity {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      min-width: 30px;
      text-align: center;
    }
    
    .item-right {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-direction: column;
    }

    @media (max-width: 768px) {
      .item-right {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
    
    .item-price {
      text-align: right;
    }

    @media (max-width: 768px) {
      .item-price {
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
      }
    }
    
    .price-amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: #c62828;
    }

    @media (max-width: 768px) {
      .price-amount {
        font-size: 1.3rem;
      }
    }
    
    .price-currency {
      font-size: 1rem;
      color: #666;
      margin-left: 5px;
    }

    @media (max-width: 768px) {
      .price-currency {
        font-size: 0.9rem;
      }
    }
    
    .btn-remove {
      background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .btn-remove {
        padding: 8px 12px;
        font-size: 0.85rem;
      }
    }
    
    .btn-remove:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }

    .btn-edit-note {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .btn-edit-note {
        padding: 8px 12px;
        font-size: 0.85rem;
      }
    }
    
    .btn-edit-note:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }
    
    .cart-summary {
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .cart-summary {
        margin-top: 20px;
      }
    }
    
    .summary-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .summary-card {
        padding: 20px;
      }
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #ddd;
    }

    @media (max-width: 768px) {
      .total-row {
        margin-bottom: 20px;
        padding-bottom: 15px;
      }
    }
    
    .total-label {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .total-label {
        font-size: 1.2rem;
      }
    }
    
    .total-amount {
      font-size: 2rem;
      font-weight: bold;
      color: #c62828;
    }

    @media (max-width: 768px) {
      .total-amount {
        font-size: 1.5rem;
      }
    }
    
    .currency {
      font-size: 1.2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .currency {
        font-size: 1rem;
      }
    }
    
    .btn-order {
      width: 100%;
      padding: 18px;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .btn-order {
        padding: 15px;
        font-size: 1.1rem;
      }
    }
    
    .btn-icon {
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .btn-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class CartComponent {
  cartItems: CartItem[] = [];

  constructor(private foodService: FoodService, private router: Router) {
    this.cartItems = this.foodService.getCart();
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    if (confirm('คุณต้องการลบรายการนี้ออกจากตะกร้าหรือไม่?')) {
      this.foodService.removeFromCart(itemId);
      this.cartItems = this.foodService.getCart();
    }
  }

  editNote(index: number) {
    const currentNote = this.cartItems[index].note || '';
    const newNote = prompt(`แก้ไขหมายเหตุสำหรับ ${this.cartItems[index].name}:`, currentNote);
    if (newNote !== null) {
      this.foodService.updateItemNote(index, newNote);
      this.cartItems = this.foodService.getCart();
    }
  }

  goToOrder() {
    this.router.navigate(['/order']);
  }
}