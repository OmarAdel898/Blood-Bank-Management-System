import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-deliveries-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deliveries-section.html',
  styleUrls: ['./deliveries-section.css']
})
export class DeliveriesSectionComponent {
  @Input() deliveries: Delivery[] = [];

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      delayed: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}

