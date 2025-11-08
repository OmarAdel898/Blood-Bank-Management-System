import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorsDashboard } from './donors-dashboard.component';
import { CalendarComponent } from '../calendar/calendar';


describe('DonorsDashboard', () => {
  let component: DonorsDashboard;
  let fixture: ComponentFixture<DonorsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
