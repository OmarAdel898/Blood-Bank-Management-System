import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-org',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-org.html',
  styleUrl: './register-org.css',
})
export class RegisterOrg implements OnInit {
  orgForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.orgForm = this.fb.group(
      {
        orgName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        address: ['', Validators.required],
        headName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.orgForm.valid) {
      console.log('Org Data:', this.orgForm.value);
      // Here you can send data to the server.
    } else {
      this.orgForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
