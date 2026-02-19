import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '../../material/material';
import { NumberOnlyDirective } from "../../directives/numberonly.directive";
import { masterService } from '../../../services/master.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, Subject, switchMap } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sortlink-dialog',
  standalone: true,
  imports: [...MATERIAL_MODULES, MatDialogModule, MatButtonModule, MatFormField, MatLabel, MatError, FormsModule, ReactiveFormsModule, CommonModule, NumberOnlyDirective],
  templateUrl: './sortlink-dialog.component.html',
  styleUrl: './sortlink-dialog.component.scss'
})
export class SortlinkDialogComponent implements OnInit {
  type: string;
  title: string;
  feedbackForm!: FormGroup;
  getCaptchadata: any;
  captcha: any;
  captchaCode: any;
  captchaImageSrc :any
    mobileInput$ = new Subject<string>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string; title: string },
    private fb: FormBuilder,
    private masterService: masterService,
    private toastr: ToastrService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<SortlinkDialogComponent>
  ) {
    console.log(data, 'data');
    this.type = this.data.type
    this.title = this.data.title

  }


  ngOnInit(): void {
    this.generateCaptcha();
    this.getfeedbackForm();

  }



  getfeedbackForm() {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      message: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      captcha: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(6)]],
      subject: ['', Validators.required]
    });
  }

  get f() {
    return this.feedbackForm.controls;
  }
  isSubmitted: boolean = false
  submitFeedback() {
  this.isSubmitted = true;

  // ❌ Form invalid
  if (this.feedbackForm.invalid) {
    this.feedbackForm.markAllAsTouched();
    this.toastr.error("Feedback Form Is Invalid");
    return;
  }

  // 🔐 Captcha value
  const enteredCaptcha = this.feedbackForm.get('captcha')?.value;

  if (!enteredCaptcha || enteredCaptcha.trim() === '') {
    this.toastr.error('Please enter captcha');
    return;
  }

  // 🧾 Session check
  const sessionId = sessionStorage.getItem('sessionId1');
  if (!sessionId) {
    this.toastr.error('Session expired. Please refresh captcha');
    this.generateCaptcha();
    return;
  }

  const payload = {
    captcha: enteredCaptcha
  }

  // 🔥 Step 1: Verify Captcha
  this.masterService.verifyCaptcha(payload).subscribe({
    next: (captchaRes: any) => {

      if (captchaRes.messageCode !== 1) {
        this.toastr.error(captchaRes.message || 'Invalid Captcha');
        this.feedbackForm.get('captcha')?.reset();
        this.generateCaptcha();
        return;
      }
      // 🔐 Step 2: Login API
      const feedbackdata = this.feedbackForm.getRawValue();
      const feedbackPayload = {
      name: feedbackdata.name,
      contactNo: feedbackdata.mobile,
      emailId: feedbackdata.email,
      subject: feedbackdata.subject,
      feedbackDetails: feedbackdata.message
      };

      this.masterService.citizenFeedback(feedbackPayload).subscribe({
        next: (response: any) => {
          if (response.messageCode === 1) {
           this.alertService.successwithok(response.message, () => {
            this.feedbackForm.reset();
            this.isSubmitted = false;
            this.dialogRef.close(true);
          }); 
          } else {
            this.alertService.error(response.message);
          }
        },
        error: () => {
          this.toastr.error('Feedback API error');
        }
      });
    },
    error: (err) => {
      const msg = err?.error?.message || 'Invalid Captcha';
      this.toastr.error(msg);
      this.feedbackForm.get('captcha')?.reset();
      this.generateCaptcha();
    }
  });
}

  // submitFeedback1() {
  //   if (this.feedbackForm.valid) {
  //     console.log(this.feedbackForm.value);
  //     this.feedbackForm.reset();
  //   }
  // }

  onMobileKeyUp() {
    const control = this.feedbackForm.get('mobile');
    if (control?.valid && control?.value.length === 10) {
      this.mobileInput$.next(control.value);
    }
  }
generateCaptcha() {
  this.masterService.generateCaptcha().subscribe((response: any) => {
    this.getCaptchadata = response.data;
    this.captcha = this.getCaptchadata.captcha;
    this.captchaCode = this.getCaptchadata.captchaCode;
    sessionStorage.setItem('sessionId1', response.data.sessionId);
    this.captchaImageSrc = 'data:image/png;base64,' + this.captcha;
  });
}

  

  reload() {
    this.generateCaptcha();
    this.feedbackForm.reset();
  }

  speakCaptcha() {
    if (!this.captchaCode) {
      return;
    }

    // Stop previous speech (important)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      this.captchaCode.split('').join(' ')
    );

    utterance.lang = 'en-IN';
    utterance.rate = 0.6;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }
}
