import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Donor } from '../../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-donors-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donors-section.html',
  styleUrls: ['./donors-section.css']
})
export class DonorsSectionComponent {
  @Input() todayDonors: Donor[] = [];
  @Output() addDonor = new EventEmitter<void>();
  @Output() markComplete = new EventEmitter<Donor>();

  formatTime(time: string): string {
    return time;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  onAddDonor(): void {
    this.addDonor.emit();
  }

  onMarkComplete(donor: Donor): void {
    this.markComplete.emit(donor);
  }
}

