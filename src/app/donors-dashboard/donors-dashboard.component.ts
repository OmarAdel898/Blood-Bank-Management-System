import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar';

@Component({
  selector: 'app-donors-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CalendarComponent],
  
  templateUrl: './donors-dashboard.component.html',
  styleUrls: ['./donors-dashboard.component.css']
})
export class DonorsDashboardComponent implements OnInit {

  donor = {
    fullName: 'Ahmed Ali',
    email: 'ahmed@example.com',
    district: 'Nasr City',
    phoneNumber: '01012345678',
    pincode: '11765',
    age: 28,
    bloodGroup: 'O+',
    address: 'Cairo, Egypt',
    lastDonationDate: '2025-06-20'
  };

  editMode = false;
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: [this.donor.fullName],
      email: [this.donor.email],
      district: [this.donor.district],
      phoneNumber: [this.donor.phoneNumber],
      pincode: [this.donor.pincode],
      age: [this.donor.age],
      bloodGroup: [this.donor.bloodGroup],
      address: [this.donor.address],
      lastDonationDate: [this.donor.lastDonationDate]
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.donor = this.profileForm.value;
      this.editMode = false;
    }
  }

  cancelEdit() {
    this.profileForm.patchValue(this.donor);
    this.editMode = false;
  }
}
