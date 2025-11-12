// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   imports: [],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ⬅️ استيراد الضروريات

@Component({
  selector: 'app-login',
  // يجب إضافة ReactiveFormsModule إلى imports للمكونات المستقلة (Standalone)
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // يمكنك ترك هذا الملف فارغًا
})
export class Login implements OnInit {
  // تعريف متغير لنموذج تسجيل الدخول
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {} // ⬅️ حقن FormBuilder

  ngOnInit(): void {
    // تهيئة نموذج تسجيل الدخول
    this.loginForm = this.fb.group({
      // حقل البريد الإلكتروني: مطلوب، وتنسيق بريد إلكتروني صالح
      email: ['', [Validators.required, Validators.email]],
      // حقل كلمة المرور: مطلوب، والحد الأدنى 6 أحرف
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // دالة لمعالجة إرسال النموذج
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('بيانات تسجيل الدخول الصحيحة:', this.loginForm.value);
      // ⬅️ هنا تضع منطق الاتصال بواجهة برمجة التطبيقات (API)
    } else {
      console.log('النموذج غير صالح. يرجى مراجعة الحقول.');
      // يمكنك عرض رسائل خطأ عامة أو تمييز الحقول غير الصالحة
      this.loginForm.markAllAsTouched(); // لجعل جميع الحقول تظهر أخطاءها
    }
  }

  // دالة مساعدة للوصول السهل لعناصر التحكم بالنموذج في القالب
  get f() {
    return this.loginForm.controls;
  }
}
