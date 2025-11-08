import { Component } from '@angular/core';
import { DonorsDashboardComponent } from './donors-dashboard/donors-dashboard.component';
import { CalendarComponent } from './calendar/calendar'; // 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DonorsDashboardComponent, CalendarComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
