import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Donor } from '../../../../core/models/donor.model';
import { DonorsService } from '../../services/donors.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-donors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donors.html',
  styleUrls: ['./donors.css'],
})
export class DonorsComponent implements OnInit, OnChanges {
  @Input() refreshToken = 0;
  @Output() addDonor = new EventEmitter<void>();
  @Output() statsChange = new EventEmitter<{ todayDonations: number }>();
  @Output() inventoryUpdated = new EventEmitter<void>();

  donors: Donor[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private donorsService: DonorsService, private inventoryService: InventoryService) {}

  ngOnInit(): void {
    void this.loadDonors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      void this.loadDonors();
    }
  }

  async onMarkComplete(donor: Donor): Promise<void> {
    try {
      await this.donorsService.update(donor.id, {
        status: 'completed',
        lastDonationDate: new Date().toISOString(),
        totalDonations: donor.totalDonations + 1,
      });

      // Add corresponding unit to inventory
      const collectedDate = new Date();
      const expiryDate = new Date(collectedDate.getTime() + 42 * 24 * 60 * 60 * 1000); // ~42 days

      await this.inventoryService.add({
        bloodType: donor.bloodType,
        collectedDate: collectedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: 'available',
        donorId: donor.id,
      });

      this.inventoryUpdated.emit();
      await this.loadDonors();
    } catch (err) {
      console.warn('Failed to update donor status', err);
    }
  }

  private async loadDonors(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const res = await this.donorsService.getAll();
      const donors = res?.data ?? [];
      this.donors = donors;
      this.emitStats(donors);
    } catch (err: any) {
      this.donors = [];
      this.error = err?.message ?? 'Failed to load donors';
      this.emitStats([]);
    } finally {
      this.isLoading = false;
    }
  }

  private emitStats(sourceList?: Donor[]): void {
    const list = sourceList ?? this.donors;
    const today = new Date().toDateString();
    const todayDonations = list.filter(
      (d) => new Date(d.donationDate).toDateString() === today && d.status === 'completed'
    ).length;
    this.statsChange.emit({ todayDonations });
  }


  formatTime(time: string): string {
    return time;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  onAddDonor(): void {
    this.addDonor.emit();
  }

  onMarkCompleteClicked(donor: Donor): void {
    void this.onMarkComplete(donor);
  }
}
