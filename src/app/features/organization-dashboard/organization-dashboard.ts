import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationDataService } from '../../admin/services/organization-data.service';
import { Subscription } from 'rxjs';
import {
  InventorySummary,
  BloodRequest,
  Donor,
  Delivery,
  Alert,
  BloodType,
  RequestStatus,
  DailyReport
} from '../../admin/models/blood-bank.models';
import { OverviewSectionComponent } from './components/overview-section/overview-section';
import { InventorySectionComponent } from './components/inventory-section/inventory-section';
import { DonorsSectionComponent } from './components/donors-section/donors-section';
import { RequestsSectionComponent } from './components/requests-section/requests-section';
import { DeliveriesSectionComponent } from './components/deliveries-section/deliveries-section';
import { RequestModalComponent } from './components/request-modal/request-modal';
import { DonorModalComponent } from './components/donor-modal/donor-modal';
import { ReportModalComponent } from './components/report-modal/report-modal';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverviewSectionComponent,
    InventorySectionComponent,
    DonorsSectionComponent,
    RequestsSectionComponent,
    DeliveriesSectionComponent,
    RequestModalComponent,
    DonorModalComponent,
    ReportModalComponent
  ],
  templateUrl: './organization-dashboard.html',
  styleUrls: ['./organization-dashboard.css']
})
export class OrganizationDashboardComponent implements OnInit, OnDestroy {
  // UI State
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  activeSection: 'overview' | 'inventory' | 'donors' | 'requests' | 'deliveries' | 'reports' = 'overview';

  // Data
  inventorySummary: InventorySummary[] = [];
  todayDonors: Donor[] = [];
  requests: BloodRequest[] = [];
  filteredRequests: BloodRequest[] = [];
  deliveries: Delivery[] = [];
  alerts: Alert[] = [];
  dailyReport: DailyReport | null = null;

  // Quick Stats
  totalAvailableUnits = 0;
  unitsExpiringSoon = 0;
  activeRequests = 0;
  todayDonations = 0;
  pendingDeliveries = 0;

  // Filters
  requestFilter = {
    search: '',
    bloodType: '' as BloodType | '',
    status: '' as RequestStatus | ''
  };

  // Forms
  requestForm!: FormGroup;
  donorForm!: FormGroup;

  // Modals
  showRequestModal = false;
  showDonorModal = false;
  showReportModal = false;

  private subscriptions = new Subscription();

  constructor(
    private dataService: OrganizationDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForms(): void {
    this.requestForm = this.fb.group({
      hospitalName: ['', Validators.required],
      patientName: [''],
      bloodType: ['', Validators.required],
      unitsNeeded: [1, [Validators.required, Validators.min(1)]],
      priority: ['medium', Validators.required],
      location: this.fb.group({
        address: ['']
      })
    });

    this.donorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      bloodType: ['', Validators.required],
      donationDate: [new Date().toISOString().split('T')[0], Validators.required],
      donationTime: [new Date().toTimeString().slice(0, 5), Validators.required]
    });
  }

  private loadData(): void {
    // Inventory Summary
    this.subscriptions.add(
      this.dataService.getInventorySummary().subscribe(summary => {
        this.inventorySummary = summary;
        this.calculateQuickStats();
      })
    );

    // Today's Donors
    this.subscriptions.add(
      this.dataService.getTodayDonors().subscribe(donors => {
        this.todayDonors = donors;
        this.todayDonations = donors.filter(d => d.status === 'completed').length;
      })
    );

    // Requests
    this.subscriptions.add(
      this.dataService.getRequests().subscribe(requests => {
        this.requests = requests;
        this.applyRequestFilters();
        this.calculateQuickStats();
      })
    );

    // Deliveries
    this.subscriptions.add(
      this.dataService.getActiveDeliveries().subscribe(deliveries => {
        this.deliveries = deliveries;
        this.pendingDeliveries = deliveries.length;
      })
    );

    // Alerts
    this.subscriptions.add(
      this.dataService.getUnacknowledgedAlerts().subscribe(alerts => {
        this.alerts = alerts;
      })
    );

    // Daily Report
    this.loadDailyReport();
  }

  private calculateQuickStats(): void {
    this.totalAvailableUnits = this.inventorySummary.reduce(
      (sum, s) => sum + s.availableUnits, 0
    );
    this.unitsExpiringSoon = this.inventorySummary.reduce(
      (sum, s) => sum + s.expiringSoon, 0
    );
    this.activeRequests = this.requests.filter(
      r => r.status === 'pending' || r.status === 'approved' || r.status === 'in_transit'
    ).length;
  }

  private loadDailyReport(): void {
    const today = new Date().toISOString().split('T')[0];
    this.subscriptions.add(
      this.dataService.getDailyReport(today).subscribe(report => {
        this.dailyReport = report;
      })
    );
  }

  // ========== REQUESTS ==========
  applyRequestFilters(): void {
    let filtered = [...this.requests];

    if (this.requestFilter.search) {
      const search = this.requestFilter.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.requestNumber.toLowerCase().includes(search) ||
        r.hospitalName.toLowerCase().includes(search) ||
        r.patientName?.toLowerCase().includes(search)
      );
    }

    if (this.requestFilter.bloodType) {
      filtered = filtered.filter(r => r.bloodType === this.requestFilter.bloodType);
    }

    if (this.requestFilter.status) {
      filtered = filtered.filter(r => r.status === this.requestFilter.status);
    }

    this.filteredRequests = filtered;
  }

  openNewRequest(): void {
    this.requestForm.reset({
      priority: 'medium',
      unitsNeeded: 1
    });
    this.showRequestModal = true;
  }

  saveRequest(): void {
    if (this.requestForm.invalid) return;
    const data = this.requestForm.value;
    this.dataService.addRequest({
      ...data,
      requestedDate: new Date().toISOString(),
      requestedTime: new Date().toTimeString().slice(0, 5),
      status: 'pending'
    });
    this.showRequestModal = false;
  }

  updateRequestStatus(request: BloodRequest, status: RequestStatus): void {
    this.dataService.updateRequest(request.id, { status });
  }

  onRequestStatusUpdate(event: { request: BloodRequest; status: RequestStatus }): void {
    this.updateRequestStatus(event.request, event.status);
  }

  // ========== DONORS ==========
  openNewDonor(): void {
    this.donorForm.reset({
      donationDate: new Date().toISOString().split('T')[0],
      donationTime: new Date().toTimeString().slice(0, 5)
    });
    this.showDonorModal = true;
  }

  saveDonor(): void {
    if (this.donorForm.invalid) return;
    const data = this.donorForm.value;
    this.dataService.addDonor({
      ...data,
      donationDate: new Date(data.donationDate).toISOString(),
      status: 'scheduled',
      eligibilityStatus: 'eligible',
      totalDonations: 0
    });
    this.showDonorModal = false;
  }

  markDonationComplete(donor: Donor): void {
    this.dataService.updateDonor(donor.id, {
      status: 'completed',
      lastDonationDate: new Date().toISOString(),
      totalDonations: donor.totalDonations + 1
    });
  }

  // ========== ALERTS ==========
  acknowledgeAlert(alert: Alert): void {
    this.dataService.acknowledgeAlert(alert.id);
  }

  // ========== REPORTS ==========
  openReportModal(): void {
    this.showReportModal = true;
  }

  exportReport(format: 'csv' | 'pdf'): void {
    if (!this.dailyReport) return;
    
    if (format === 'csv') {
      const csv = this.generateCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('PDF export would be implemented with a PDF library');
    }
  }

  private generateCSV(): string {
    if (!this.dailyReport) return '';
    
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

  // ========== UTILITIES ==========
  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatTime(time: string): string {
    return time;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800'
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

  getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  }

  closeModals(): void {
    this.showRequestModal = false;
    this.showDonorModal = false;
    this.showReportModal = false;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.sidebarMobileOpen = !this.sidebarMobileOpen;
  }

  closeMobileSidebar(): void {
    this.sidebarMobileOpen = false;
  }

  setActiveSection(section: 'overview' | 'inventory' | 'donors' | 'requests' | 'deliveries' | 'reports'): void {
    this.activeSection = section;
    // Close mobile sidebar when navigating
    this.sidebarMobileOpen = false;
  }
}

