import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppForm } from '../../shared/form/form';

@Component({
  selector: 'blood-request',
  standalone: true,
  imports: [AppForm],
  templateUrl: './blood-request.html',
  styleUrls: ['./blood-request.css'],
})
export class BloodRequest {
  requestFields = [
    {
      name: 'patientfulltName',
      label: 'Patient Full Name',
      placeholder: '',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Full name is required' }],
    },

    {
      name: 'patientAge',
      label: 'Patient Age',
      type: 'number',
      validators: [Validators.required, Validators.min(0)],
      errors: [{ type: 'required', msg: 'Age is required' }],
    },
    {
      name: 'patientGender',
      label: 'Patient Gender',
      type: 'select',
      placeholder: 'Select Gender',
      options: ['Male', 'Female'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Gender is required' }],
    },
    {
      name: 'patientBloodGroup',
      label: 'Patient Blood Group',
      type: 'select',
      placeholder: 'Blood Group',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'requestReason',
      label: 'Reason for Request',
      type: 'select',
      placeholder: 'Select Reason',
      options: ['Surgery', 'Emergency', 'Critical Condition'],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'neededBefore',
      label: 'Needed Before',
      type: 'date',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Required' }],
    },
    {
      name: 'requesterphoneNumber',
      label: 'Requester Phone Number',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Phone is required' }],
    },
    {
      name: 'governorate',
      label: 'Governorate',
      type: 'select',
      placeholder: 'Select Governorate',
      options: [
        'Cairo',
        'Giza',
        'Alexandria',
        'Dakahlia',
        'Red Sea',
        'Beheira',
        'Fayoum',
        'Gharbia',
        'Ismailia',
        'Menofia',
        'Minya',
        'Qaliubiya',
        'New Valley',
        'Suez',
        'Aswan',
        'Assiut',
        'Beni Suef',
        'Port Said',
        'Damietta',
        'Sharkia',
        'South Sinai',
        'Kafr El Sheikh',
        'Matrouh',
        'Luxor',
        'Qena',
        'North Sinai',
        'Sohag',
      ],
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Governorate is required' }],
    },

    {
      name: 'district',
      label: 'District',
      type: 'text',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'District is required' }],
    },

    {
      name: 'patientidCard',
      label: 'Patient ID Card Image',
      type: 'file',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'ID Card image is required' }],
    },
    {
      name: 'medicalReport',
      label: 'Medical Report',
      type: 'file',
      validators: [Validators.required],
      errors: [{ type: 'required', msg: 'Medical report is required' }],
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Additional details (optional)',
      validators: [],
      errors: [],
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
    console.log('DONOR DATA:', val);
  }
}
