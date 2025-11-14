import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventorySummary } from '../../../../admin/models/blood-bank.models';

@Component({
  selector: 'app-inventory-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-section.html',
  styleUrls: ['./inventory-section.css']
})
export class InventorySectionComponent {
  @Input() inventorySummary: InventorySummary[] = [];

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}

