import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyReport } from '../../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-modal.html',
  styleUrls: ['./report-modal.css']
})
export class ReportModalComponent {
  @Input() show = false;
  @Input() dailyReport: DailyReport | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() export = new EventEmitter<'csv' | 'pdf'>();

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  onClose(): void {
    this.close.emit();
  }

  onExport(format: 'csv' | 'pdf'): void {
    this.export.emit(format);
  }
}

