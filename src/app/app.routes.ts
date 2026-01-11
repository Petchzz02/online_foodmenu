import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu.component';
import { CartComponent } from './pages/cart.component';
import { ServeComponent } from './pages/serve.component';
import { CallStaffComponent } from './pages/call-staff.component';
import { PaymentComponent } from './pages/payment.component';

export const routes: Routes = [
  { path: '', component: MenuComponent, title: 'เลือกเมนูอาหาร' },
  { path: 'cart', component: CartComponent, title: 'ตะกร้าสินค้า' },
  { path: 'serve', component: ServeComponent, title: 'สถานะการทำอาหาร' },
  { path: 'call-staff', component: CallStaffComponent, title: 'เรียกพนักงาน' },
  { path: 'payment', component: PaymentComponent, title: 'ชำระเงิน' },
  { path: '**', redirectTo: '' }
];