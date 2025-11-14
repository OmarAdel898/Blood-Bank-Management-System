import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BloodRequest, BloodType, RequestStatus } from '../../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-requests-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests-section.html',
  styleUrls: ['./requests-section.css']
})
export class RequestsSectionComponent {
  @Input() requests: BloodRequest[] = [];
  @Input() filteredRequests: BloodRequest[] = [];
  @Input() requestFilter = {
    search: '',
    bloodType: '' as BloodType | '',
    status: '' as RequestStatus | ''
  };

  @Output() addRequest = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<void>();
  @Output() updateStatus = new EventEmitter<{ request: BloodRequest; status: RequestStatus }>();

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  onAddRequest(): void {
    this.addRequest.emit();
  }

  onFilterChange(): void {
    this.filterChange.emit();
  }

  onUpdateStatus(request: BloodRequest, status: RequestStatus): void {
    this.updateStatus.emit({ request, status });
  }
}

