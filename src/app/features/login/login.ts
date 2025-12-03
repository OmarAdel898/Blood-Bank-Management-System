import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const user = await this.auth.login(email, password);

    if (!user) {
      this.errorMessage = 'Invalid email or password';
      return;
    }

    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user.role === 'organization') {
      this.router.navigate(['/organization-dashboard']);
    } else {
      this.errorMessage = 'Access denied';
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
// })
// export class Login implements OnInit {

//   loginForm!: FormGroup;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       console.log('Valid login data:', this.loginForm.value);
//     } else {
//       console.log('The form is invalid. Please check the fields.');
//       this.loginForm.markAllAsTouched();
//     }
//   }

//   get f() {
//     return this.loginForm.controls;
//   }
// }
