import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
})
export class CalendarComponent {
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];

  currentMonth: number;
  currentYear: number;
  daysInMonth: number[] = [];
  startDay!: number;

  constructor() {
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();

    for (let i = 2010; i <= 2030; i++) {
      this.years.push(i);
    }

    this.generateCalendar();
  }

  generateCalendar() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
    this.startDay = firstDay === 0 ? 6 : firstDay - 1;
  }

  onMonthChange(event: any) {
    this.currentMonth = parseInt(event.target.value, 10);
    this.generateCalendar();
  }

  onYearChange(event: any) {
    this.currentYear = parseInt(event.target.value, 10);
    this.generateCalendar();
  }
}
