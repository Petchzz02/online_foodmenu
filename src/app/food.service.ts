import { Injectable } from '@angular/core';

// โครงสร้างข้อมูลเมนูอาหาร
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

// โครงสร้างข้อมูลสินค้าในตะกร้า (เพิ่มจำนวน)
export interface CartItem extends MenuItem {
  quantity: number;
  note?: string; // หมายเหตุเฉพาะรายการอาหารนี้
}

// โครงสร้างข้อมูลออเดอร์
export interface Order {
  orderId: number;
  tableId: number;
  items: CartItem[];
  totalPrice: number;
  status: 'preparing' | 'served'; // preparing=กำลังทำอาหาร, served=เสิร์ฟแล้ว
  isPaid: boolean; // สถานะการชำระเงิน
  timestamp: Date;
  note?: string; // หมายเหตุจากลูกค้า
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  // 1. รายการอาหาร 10 เมนู
  private menuItems: MenuItem[] = [
    { id: 1, name: 'ส้มตำไทย', price: 60, image: 'https://png.pngtree.com/thumb_back/fh260/background/20240329/pngtree-thai-papaya-salad-som-tum-image_15665062.jpg' },
    { id: 2, name: 'ส้มตำปูปลาร้า', price: 60, image: 'https://png.pngtree.com/thumb_back/fh260/background/20220122/pngtree-thaistyle-green-papaya-salad-with-salted-crab-dish-lunch-cuisine-photo-image_7994170.jpg' },
    { id: 3, name: 'ตำข้าวโพด', price: 70, image: 'https://png.pngtree.com/thumb_back/fh260/background/20220806/pngtree-thaiinspired-spicy-corn-salad-with-salted-eggs-thai-style-som-photo-image_28087024.jpg' },
    { id: 4, name: 'ไก่ย่าง', price: 120, image: 'https://food.mthai.com/app/uploads/2018/12/Grilled-Chicken-with-Turmeric.jpg' },
    { id: 5, name: 'คอหมูย่าง', price: 100, image: 'https://png.pngtree.com/thumb_back/fh260/background/20221124/pngtree-grilled-pork-neck-fresh-gourmet-grill-photo-image_20583972.jpg' },
    { id: 6, name: 'น้ำตกหมู', price: 90, image: 'https://s359.kapook.com/pagebuilder/d09b5d3c-dba5-4be4-bf62-2f70fd9946f7.jpg' },
    { id: 7, name: 'ลาบหมู', price: 90, image: 'https://png.pngtree.com/png-clipart/20240518/original/pngtree-larb-mu-spicy-minced-pork-pork-liver-and-ground-pork-salad-png-image_15128104.png' },
    { id: 8, name: 'ต้มแซ่บ', price: 120, image: 'https://img.kapook.com/u/2023/wanwanat/2082317182.jpg' },
    { id: 9, name: 'ข้าวเหนียว', price: 15, image: 'https://www.thammculture.com/wp-content/uploads/2023/03/Untitled-396.jpg' },
    { id: 10, name: 'ขนมจีน', price: 15, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQKlHi40Q5hm0Lat6GmScYxhvq7nV2_oWtbQ&s' }
  ];

  // 2. ข้อมูลโต๊ะ 20 โต๊ะ
  tables = Array.from({ length: 20 }, (_, i) => i + 1);

  // ตัวแปรเก็บข้อมูลชั่วคราว
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private selectedTableId: number | null = null; // โต๊ะที่เลือกในปัจจุบัน

  constructor() { }

  // ดึงเมนูทั้งหมด
  getMenu() {
    return this.menuItems;
  }

  // จัดการโต๊ะที่เลือก
  setSelectedTable(tableId: number) {
    this.selectedTableId = tableId;
  }

  getSelectedTable() {
    return this.selectedTableId;
  }

  // ดึงของในตะกร้า
  getCart() {
    return this.cart;
  }

  // เพิ่มของลงตะกร้า
  addToCart(item: MenuItem, note?: string) {
    const existing = this.cart.find(i => i.id === item.id && i.note === note);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...item, quantity: 1, note: note });
    }
  }

  // ลบของออกจากตะกร้า
  removeFromCart(itemId: number) {
    this.cart = this.cart.filter(i => i.id !== itemId);
  }

  // อัพเดทหมายเหตุของรายการ
  updateItemNote(index: number, note: string) {
    if (this.cart[index]) {
      this.cart[index].note = note;
    }
  }

  // อัพเดทจำนวนสินค้า
  updateQuantity(itemId: number, change: number) {
    const item = this.cart.find(i => i.id === itemId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      }
    }
  }

  // ล้างตะกร้า
  clearCart() {
    this.cart = [];
  }

  // สั่งอาหาร (สร้าง Order)
  placeOrder(note?: string) {
    if (this.cart.length === 0 || !this.selectedTableId) return;

    const newOrder: Order = {
      orderId: Date.now(),
      tableId: this.selectedTableId,
      items: [...this.cart],
      totalPrice: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'preparing',
      isPaid: false,
      timestamp: new Date(),
      note: note
    };

    this.orders.push(newOrder);
    this.clearCart(); // สั่งเสร็จล้างตะกร้า
  }

  // ดึงออเดอร์ทั้งหมด (สำหรับหน้าครัว)
  getOrders() {
    return this.orders;
  }

  // เปลี่ยนสถานะเป็นเสิร์ฟแล้ว
  markAsServed(orderId: number) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = 'served';
    }
  }

  // เปลี่ยนสถานะเป็นชำระเงินแล้ว
  markAsPaid(orderId: number) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.isPaid = true;
    }
  }

  // ดึงออเดอร์ที่ยังไม่ชำระเงินของโต๊ะ
  getUnpaidOrdersByTable(tableId: number) {
    return this.orders.filter(o => o.tableId === tableId && !o.isPaid);
  }
}