import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-donor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-donor.html',
  styleUrls: ['./register-donor.css'],
})
export class RegisterDonor implements OnInit {
  donorForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.donorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      bloodGroup: ['', Validators.required],
      governorate: ['', Validators.required],
      district: ['', Validators.required],
      lastDonationMonth: [''],
      lastDonationYear: [''],
      agreeTerms: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.donorForm.valid) {
      console.log('Donor Data:', this.donorForm.value);
      // Here you can send data to the server.
    } else {
      this.donorForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
