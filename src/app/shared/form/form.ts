import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class AppForm {
  @Input() title: string = '';

  @Input() fields: any[] = [];

  @Output() submitForm = new EventEmitter<any>();

  constructor(private router: Router) {}

  form = signal(new FormGroup({}));
  submittedMessage = signal('');

  // --------------- FIXED VALIDATOR ---------------
  passwordMatchValidator(control: AbstractControl) {
    const form = control as FormGroup;

    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    if (!confirm) return null;

    return pass === confirm ? null : { passwordMismatch: true };
  }

  ngOnInit() {
    const group: any = {};

    this.fields.forEach((f) => {
      group[f.name] = new FormControl(f.defaultValue || '', f.validators || []);
    });

    const formGroup = new FormGroup(group, {
      validators: this.passwordMatchValidator.bind(this),
    });

    this.form.set(formGroup);
  }
  getErrorMessage(field: any, errorType: string): string {
    const err = field.errors?.find((e: any) => e.type === errorType);
    return err ? err.msg : 'Required';
  }

  fileData: { [key: string]: File | null } = {};

  onFileChange(event: any, fieldName: string) {
    const file: File = event.target.files[0];
    this.fileData[fieldName] = file || null;

    const control = this.getFieldControl(fieldName);
    if (control) {
      control.setValue(file ? file.name : '');
      control.markAsTouched();
    }
  }

  getFieldControl(name: string) {
    return this.form().get(name);
  }
  getPasswordMismatchMessage(field: any) {
    const err = field.errors?.find((e: any) => e.type === 'passwordMismatch');
    return err ? err.msg : 'Passwords do not match';
  }

  onSubmit() {
    if (this.form().valid) {
      this.submitForm.emit(this.form().value);
      this.submittedMessage.set('Your registration request is under review');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);
    } else {
      Object.keys(this.form().controls).forEach((key) => {
        this.form().get(key)?.markAsTouched();
      });
    }
  }
}
