import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';

@Component({
  selector: 'recipient',
  standalone: true,
  imports: [AppForm],
  templateUrl: './register-recipient.html',
  styleUrls: ['./register-recipient.css'],
})
export class RegisterRecipient {
  recipientFields = [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
      errors: [
        { type: 'required', msg: 'Required' },
        { type: 'email', msg: 'Invalid email' },
      ],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
      errors: [
        { type: 'required', msg: 'Password required' },
        { type: 'minlength', msg: 'Min 6 chars' },
      ],
      successMessage: 'Valid password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [Validators.required],
      errors: [
        { type: 'required', msg: 'Please confirm password' },
        { type: 'passwordMismatch', msg: 'Passwords do not match' },
      ],
      successMessage: 'Passwords match',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'idCard',
      label: 'ID Card Image',
      type: 'file',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'ID Card image is required' }],
    },
    {
      name: 'agreeTerms',
      label:
        'I confirm that the information provided is accurate and I agree to be contacted for blood donation purposes.',
      type: 'checkbox',
      validators: [Validators.requiredTrue],
      errors: [{ type: 'required', msg: 'You must agree to the terms' }],
    },
  ];

  onSubmit(val: any) {
    console.log('RECIPIENT:', val);
  }
}
