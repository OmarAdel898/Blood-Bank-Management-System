import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DonorsService } from './services/donors.service';
import { InventoryService } from './services/inventory.service';
import { RequestsService } from './services/requests.service';
import { DeliveriesService } from './services/deliveries.service';
import { ReportsService } from './services/reports.service';

import { OverviewComponent } from './pages/overview/overview';
import { InventoryComponent } from './pages/inventory/inventory';
import { DonorsComponent } from './pages/donors/donors';
import { RequestsComponent } from './pages/requests/requests';
import { DeliveriesComponent } from './pages/deliveries/deliveries';
import { RequestModalComponent } from './components/request-modal/request-modal';
import { DonorModalComponent } from './components/donor-modal/donor-modal';
import { ReportModalComponent } from './components/report-modal/report-modal';
import { Alert } from '../../core/models/Alert.model';
import { Report } from '../../core/models/report.model';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverviewComponent,
    InventoryComponent,
    DonorsComponent,
    RequestsComponent,
    DeliveriesComponent,
    RequestModalComponent,
    DonorModalComponent,
    ReportModalComponent,
  ],
  templateUrl: './organization-dashboard.html',
  styleUrls: ['./organization-dashboard.css'],
})
export class OrganizationDashboardComponent implements OnInit, OnDestroy {
  // UI State
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
  activeSection: 'overview' | 'inventory' | 'donors' | 'requests' | 'deliveries' | 'reports' =
    'overview';

  // Data
  alerts: Alert[] = [];
  dailyReport: Report | null = null;

  // Quick Stats
  totalAvailableUnits = 0;
  unitsExpiringSoon = 0;
  activeRequests = 0;
  todayDonations = 0;
  pendingDeliveries = 0;

  // Child refresh triggers
  inventoryRefreshToken = 0;
  donorRefreshToken = 0;
  requestRefreshToken = 0;
  deliveryRefreshToken = 0;

  // Forms
  requestForm!: FormGroup;
  donorForm!: FormGroup;

  readonly currentDate = new Date().toLocaleDateString();

  // Modals
  showRequestModal = false;
  showDonorModal = false;

  // Loading / error state
  isLoading = false;
  error: string | null = null;

  // Note: services in this feature return Promise-based axios responses.

  constructor(
    private donorsService: DonorsService,
    private inventoryService: InventoryService,
    private requestsService: RequestsService,
    private deliveriesService: DeliveriesService,
    private reportsService: ReportsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadDailyReport();
  }

  ngOnDestroy(): void {
    // cleanup (no rx subscriptions kept here)
  }

  private initializeForms(): void {
    this.requestForm = this.fb.group({
      hospitalName: ['', Validators.required],
      patientName: [''],
      bloodType: ['', Validators.required],
      unitsNeeded: [1, [Validators.required, Validators.min(1)]],
      priority: ['medium', Validators.required],
      location: this.fb.group({
        address: [''],
      }),
    });

    this.donorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      bloodType: ['', Validators.required],
      donationDate: [new Date().toISOString().split('T')[0], Validators.required],
      donationTime: [new Date().toTimeString().slice(0, 5), Validators.required],
    });
  }

  private loadDailyReport(): void {
    const today = new Date().toISOString().split('T')[0];

    Promise.all([
      this.donorsService.getAll(),
      this.requestsService.getAll(),
      this.deliveriesService.getAll(),
      this.inventoryService.getAll(),
    ])
      .then(([donorsRes, requestsRes, deliveriesRes, inventoryRes]) => {
        const donors = donorsRes.data || [];
        const requests = requestsRes.data || [];
        const deliveries = deliveriesRes.data || [];
        const inventory = inventoryRes.data || [];

        const reportDate = new Date(today);
        const dayStart = new Date(reportDate.setHours(0, 0, 0, 0));
        const dayEnd = new Date(reportDate.setHours(23, 59, 59, 999));

        const dayDonations = donors.filter((d: any) => {
          const donationDate = new Date(d.donationDate);
          return donationDate >= dayStart && donationDate <= dayEnd && d.status === 'completed';
        }).length;

        const dayRequests = requests.filter((r: any) => {
          const requestDate = new Date(r.requestedDate);
          return requestDate >= dayStart && requestDate <= dayEnd;
        }).length;

        const dayDeliveries = deliveries.filter((d: any) => {
          if (!d.actualArrival) return false;
          const deliveryDate = new Date(d.actualArrival);
          return deliveryDate >= dayStart && deliveryDate <= dayEnd && d.status === 'delivered';
        }).length;

        const bloodTypes: any[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const inventoryChanges = bloodTypes.map((bt) => {
          const dayUnits = inventory.filter((u: any) => {
            const collected = new Date(u.collectedDate);
            const expired = u.status === 'expired' ? new Date(u.expiryDate) : null;
            return (
              u.bloodType === bt &&
              ((collected >= dayStart && collected <= dayEnd) ||
                (expired && expired >= dayStart && expired <= dayEnd))
            );
          });

          return {
            bloodType: bt,
            added: dayUnits.filter(
              (u: any) =>
                new Date(u.collectedDate) >= dayStart && new Date(u.collectedDate) <= dayEnd
            ).length,
            used: 0,
            expired: dayUnits.filter((u: any) => u.status === 'expired').length,
          };
        });

        this.dailyReport = {
          date: today,
          totalDonations: dayDonations,
          totalRequests: dayRequests,
          completedDeliveries: dayDeliveries,
          inventoryChanges,
        } as any;
      })
      .catch((err) => {
        console.warn('Failed to load daily report', err);
        this.dailyReport = null;
      });
  }

  onInventoryStatsChange(stats: { totalAvailableUnits: number; unitsExpiringSoon: number }): void {
    this.totalAvailableUnits = stats.totalAvailableUnits;
    this.unitsExpiringSoon = stats.unitsExpiringSoon;
  }

  onDonorStatsChange(stats: { todayDonations: number }): void {
    this.todayDonations = stats.todayDonations;
  }

  onRequestStatsChange(stats: { activeRequests: number }): void {
    this.activeRequests = stats.activeRequests;
  }

  onDeliveryStatsChange(stats: { pendingDeliveries: number }): void {
    this.pendingDeliveries = stats.pendingDeliveries;
  }

  onDonorInventoryUpdated(): void {
    this.inventoryRefreshToken++;
  }

  onRequestDeliveriesChange(): void {
    this.deliveryRefreshToken++;
  }

  openNewRequest(): void {
    this.requestForm.reset({
      priority: 'medium',
      unitsNeeded: 1,
    });
    this.showRequestModal = true;
  }

  saveRequest(): void {
    if (this.requestForm.invalid) return;
    const data = this.requestForm.value;
    this.requestsService
      .add({
        ...data,
        requestedDate: new Date().toISOString(),
        requestedTime: new Date().toTimeString().slice(0, 5),
        status: 'pending',
      })
      .then(() => {
        this.requestRefreshToken++;
      })
      .finally(() => {
        this.showRequestModal = false;
      });
  }

  // ========== DONORS ==========
  openNewDonor(): void {
    this.donorForm.reset({
      donationDate: new Date().toISOString().split('T')[0],
      donationTime: new Date().toTimeString().slice(0, 5),
    });
    this.showDonorModal = true;
  }

  saveDonor(): void {
    if (this.donorForm.invalid) return;
    const data = this.donorForm.value;
    this.donorsService
      .add({
        ...data,
        donationDate: new Date(data.donationDate).toISOString(),
        status: 'scheduled',
        eligibilityStatus: 'eligible',
        totalDonations: 0,
      })
      .then(() => {
        this.donorRefreshToken++;
      })
      .finally(() => {
        this.showDonorModal = false;
      });
  }

  // ========== ALERTS ==========
  acknowledgeAlert(alert: Alert): void {
    // No AlertsService available in this feature set; mark locally
    const idx = this.alerts.findIndex((a) => a.id === alert.id);
    if (idx >= 0) {
      this.alerts[idx].acknowledged = true;
    }
  }

  closeModals(): void {
    this.showRequestModal = false;
    this.showDonorModal = false;
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

  setActiveSection(
    section: 'overview' | 'inventory' | 'donors' | 'requests' | 'deliveries' | 'reports'
  ): void {
    this.activeSection = section;
    // Close mobile sidebar when navigating
    this.sidebarMobileOpen = false;
  }
}
