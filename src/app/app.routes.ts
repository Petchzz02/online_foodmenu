import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu.component';
import { CartComponent } from './pages/cart.component';
import { OrderComponent } from './pages/order.component';
import { ServeComponent } from './pages/serve.component';
import { PaymentComponent } from './pages/payment.component';

export const routes: Routes = [
  { path: '', component: MenuComponent, title: 'เลือกเมนูอาหาร' },
  { path: 'cart', component: CartComponent, title: 'ตะกร้าสินค้า' },
  { path: 'order', component: OrderComponent, title: 'ยืนยันออเดอร์' },
  { path: 'serve', component: ServeComponent, title: 'สถานะการทำอาหาร' },
  { path: 'payment', component: PaymentComponent, title: 'ชำระเงิน' },
  { path: '**', redirectTo: '' }
];