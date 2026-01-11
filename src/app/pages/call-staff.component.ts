import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService, StaffCall } from '../food.service';

@Component({
  selector: 'app-call-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>🔔 เรียกพนักงาน</h2>

      <!-- ฟอร์มเรียกพนักงาน -->
      <div class="call-form-section">
        <div class="form-card">
          <h3>📞 ส่งคำขอเรียกพนักงาน</h3>
          
          <div class="form-group">
            <label class="form-label">🪑 โต๊ะของคุณ:</label>
            <div *ngIf="selectedTable" class="table-display">
              <span class="table-number-large">โต๊ะที่ {{ selectedTable }}</span>
            </div>
            <div *ngIf="!selectedTable" class="no-table-message">
              ⚠️ กรูณาเลือกโต๊ะจากหน้าเมนูก่อน
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">📝 ระบุความต้องการ:</label>
            <textarea 
              [(ngModel)]="callNote" 
              class="form-textarea"
              placeholder="เช่น ขอน้ำเปล่า, ขอช้อนส้อม, ขอบิล, สอบถามเมนู..."
              rows="4">
            </textarea>
          </div>

          <button 
            (click)="sendCallRequest()" 
            [disabled]="!selectedTable || !callNote.trim()"
            class="btn btn-primary btn-call">
            <span class="btn-icon">🔔</span> ส่งคำขอเรียกพนักงาน
          </button>
        </div>
      </div>

      <!-- รายการเรียกพนักงานทั้งหมด -->
      <div class="calls-section">
        <h3>📋 รายการเรียกพนักงาน</h3>

        <div *ngIf="staffCalls.length === 0" class="empty-calls">
          <div class="empty-icon">📭</div>
          <p class="empty-text">ยังไม่มีรายการเรียกพนักงาน</p>
        </div>

        <div class="calls-grid" *ngIf="staffCalls.length > 0">
          <div *ngFor="let call of staffCalls; let i = index" 
               class="call-card" 
               [class.completed]="call.status === 'completed'"
               [style.animation-delay.ms]="i * 100">
            <div class="call-header">
              <div class="table-badge">
                <span class="table-icon">🪑</span>
                <span class="table-number">โต๊ะที่ {{ call.tableId }}</span>
              </div>
              <div class="status-badge" [class.status-pending]="call.status === 'pending'" 
                   [class.status-completed]="call.status === 'completed'">
                {{ call.status === 'pending' ? '⏳ รอดำเนินการ' : '✅ ดำเนินการแล้ว' }}
              </div>
            </div>

            <div class="call-content">
              <div class="call-note">
                <span class="note-icon">💬</span>
                <span class="note-text">{{ call.note }}</span>
              </div>
              <div class="call-time">
                <span class="time-icon">🕐</span>
                <span class="time-text">{{ formatTime(call.timestamp) }}</span>
              </div>
            </div>

            <div class="call-actions" *ngIf="call.status === 'pending'">
              <button (click)="markAsCompleted(call.callId)" class="btn-complete">
                ✅ ทำเสร็จแล้ว
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .call-form-section {
      margin-bottom: 40px;
    }

    @media (max-width: 768px) {
      .call-form-section {
        margin-bottom: 30px;
      }
    }

    .form-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .form-card {
        padding: 20px;
      }
    }

    .form-card h3 {
      margin: 0 0 25px 0;
      color: #c62828;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .form-card h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .form-label {
        font-size: 1rem;
      }
    }

    .form-select {
      width: 100%;
      padding: 12px 15px;
      font-size: 1.1rem;
      border: 2px solid #ddd;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Sarabun', sans-serif;
    }

    @media (max-width: 768px) {
      .form-select {
        padding: 10px 12px;
        font-size: 1rem;
      }
    }

    .form-select:focus {
      outline: none;
      border-color: #f4511e;
      box-shadow: 0 0 0 3px rgba(244, 81, 30, 0.1);
    }

    .table-display {
      background: linear-gradient(135deg, #f4511e 0%, #ff6f00 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
      .table-display {
        padding: 15px;
      }
    }

    .table-number-large {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .table-number-large {
        font-size: 1.5rem;
      }
    }

    .no-table-message {
      background: #fff3e0;
      color: #f57c00;
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      border-left: 4px solid #ff9800;
    }

    @media (max-width: 768px) {
      .no-table-message {
        padding: 12px;
        font-size: 0.95rem;
      }
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

    @media (max-width: 768px) {
      .form-textarea {
        padding: 10px 12px;
        font-size: 0.95rem;
      }
    }

    .form-textarea:focus {
      outline: none;
      border-color: #f4511e;
      box-shadow: 0 0 0 3px rgba(244, 81, 30, 0.1);
    }

    .btn-call {
      width: 100%;
      padding: 16px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .btn-call {
        padding: 14px;
        font-size: 1.1rem;
      }
    }

    .btn-icon {
      font-size: 1.4rem;
    }

    @media (max-width: 768px) {
      .btn-icon {
        font-size: 1.2rem;
      }
    }

    .calls-section h3 {
      color: #c62828;
      font-size: 1.5rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .calls-section h3 {
        font-size: 1.3rem;
      }
    }

    .empty-calls {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.08);
    }

    @media (max-width: 768px) {
      .empty-calls {
        padding: 40px 15px;
      }
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 15px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .empty-icon {
        font-size: 3rem;
      }
    }

    .empty-text {
      font-size: 1.3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .empty-text {
        font-size: 1.1rem;
      }
    }

    .calls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .calls-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }

    .call-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease forwards;
      opacity: 0;
      border-left: 5px solid #f4511e;
    }

    @media (max-width: 768px) {
      .call-card {
        padding: 15px;
      }
    }

    .call-card.completed {
      opacity: 0.7;
      border-left-color: #43a047;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .call-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }

    .call-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .table-badge {
      background: linear-gradient(135deg, #f4511e 0%, #ff6f00 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .table-badge {
        padding: 6px 12px;
        font-size: 0.9rem;
      }
    }

    .table-icon {
      font-size: 1.2rem;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .status-badge {
        padding: 5px 10px;
        font-size: 0.85rem;
      }
    }

    .status-pending {
      background: #fff3e0;
      color: #f57c00;
      border: 2px solid #ff9800;
    }

    .status-completed {
      background: #e8f5e9;
      color: #2e7d32;
      border: 2px solid #43a047;
    }

    .call-content {
      margin-bottom: 15px;
    }

    .call-note {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      background: #f5f5f5;
      padding: 12px;
      border-radius: 10px;
    }

    @media (max-width: 768px) {
      .call-note {
        padding: 10px;
      }
    }

    .note-icon {
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .note-text {
      font-size: 1rem;
      color: #333;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .note-text {
        font-size: 0.95rem;
      }
    }

    .call-time {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #666;
      padding-left: 12px;
    }

    .time-icon {
      font-size: 1.1rem;
    }

    .call-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .btn-complete {
      background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
    }

    @media (max-width: 768px) {
      .btn-complete {
        padding: 8px 16px;
        font-size: 0.9rem;
      }
    }

    .btn-complete:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 160, 71, 0.3);
    }
  `]
})
export class CallStaffComponent {
  tables: number[] = [];
  selectedTable: number | null = null;
  callNote: string = '';
  staffCalls: StaffCall[] = [];

  constructor(private foodService: FoodService) {
    this.tables = this.foodService.tables;
    this.selectedTable = this.foodService.getSelectedTable(); // ดึงเลขโต๊ะที่เลือกจากหน้าเมนู
    this.loadStaffCalls();
  }

  loadStaffCalls() {
    this.staffCalls = this.foodService.getStaffCalls();
  }

  sendCallRequest() {
    if (this.selectedTable && this.callNote.trim()) {
      this.foodService.callStaff(this.selectedTable, this.callNote.trim());
      alert(`✅ ส่งคำขอเรียกพนักงานสำหรับโต๊ะที่ ${this.selectedTable} แล้ว`);
      
      // รีเซ็ตฟอร์ม
      this.callNote = '';
      this.loadStaffCalls();
    }
  }

  markAsCompleted(callId: number) {
    if (confirm('ยืนยันว่าได้ดำเนินการเรียบร้อยแล้ว?')) {
      this.foodService.markCallAsCompleted(callId);
      this.loadStaffCalls();
    }
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} น.`;
  }
}
