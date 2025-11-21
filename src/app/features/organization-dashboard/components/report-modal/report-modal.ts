import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyReport } from '../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-modal.html',
  styleUrls: ['./report-modal.css']
})
export class ReportModalComponent {
  @Input() dailyReport: DailyReport | null = null;

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  onExport(format: 'csv' | 'pdf'): void {
    if (!this.dailyReport) return;

    if (format === 'csv') {
      const csv = this.generateCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-report-${this.dailyReport.date}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('PDF export would be implemented with a PDF library');
    }
  }

  private generateCSV(): string {
    if (!this.dailyReport) {
      return '';
    }

    const lines = [
      'Daily Report',
      `Date,${this.dailyReport.date}`,
      `Total Donations,${this.dailyReport.totalDonations}`,
      `Total Requests,${this.dailyReport.totalRequests}`,
      `Completed Deliveries,${this.dailyReport.completedDeliveries}`,
      '',
      'Inventory Changes',
      'Blood Type,Added,Used,Expired'
    ];

    this.dailyReport.inventoryChanges.forEach(change => {
      lines.push(`${change.bloodType},${change.added},${change.used},${change.expired}`);
    });

    return lines.join('\n');
  }
}

