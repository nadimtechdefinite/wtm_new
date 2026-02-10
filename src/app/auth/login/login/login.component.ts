import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OfficerService } from '../../../services/officer.service';
import shajs from 'sha.js';
import { debounceTime, filter, Subject, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { MobileService } from '../../../services/mobile.service';
import { masterService } from '../../../services/master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';
import { NumberOnlyDirective } from "../../../shared/directives/numberonly.directive";
import { NoPasteDirective } from '../../../shared/directives/no-paste.directive';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../user-context.model';
import { AuthService } from '../../auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...MATERIAL_MODULES, FormsModule, ReactiveFormsModule, CommonModule, NumberOnlyDirective, NoPasteDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',

})
export class LoginComponent implements OnInit {
  sessionId: any = "";
  selectedRole: string = 'citizen';
  citizenForm !: FormGroup;
  adminForm!: FormGroup;
  stateForm!: FormGroup;
  pdForm!: FormGroup;
  roleChange: any = ''
  isSubmitted = false;
  isSubmittedadmin: boolean = false
  isSubmittedState: boolean = false
  isSubmittedPd: boolean = false
  roleSubscription: any;
  isCitizen: boolean = true;
  isAdmin: boolean = true;
  isState: boolean = true;
  isPd: boolean = true;
  otpValue: string = '';
  masterStateData: any;
  otp: any;
  messageResp: any
  baseUrlMobileExist: string = 'isMobileExists'
  mobileInput$ = new Subject<string>();
  signInTitle: string = 'Citizen Sign In';
  selectedState: any;
  roles = [
    { value: 'citizen', viewValue: 'Citizen' },
    { value: 'admin', viewValue: 'Admin' },
    { value: 'pd', viewValue: 'PD' },
    // { value: 'state', viewValue: 'State' },
  ];
  users = [
    { value: 'Admin', viewValue: 'Admin' },
    { value: 'MoRD', viewValue: 'MoRD' },
  ];
  mobileVerified: any;
  otpdata: any;
  getCaptchadata: any;
  captcha: any;
  captchaCode: any;
  getcooldownPeriod: any;
  otpNumber: any;
  getschemeList: any;
  captchaId: any;

  constructor(
    private service: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private officer: OfficerService,
    private mobileService: MobileService,
    private masterService: masterService,
    private errorHandler: ErrorHandlerService,
    private auth: AuthService
  ) { }
  ngOnInit(): void {
    this.citizenForms();
    this.adminForms();
    this.stateForms();
    this.getStateMaster();
    this.schemeMaster();
    this.pdForms();
    this.generateUUID().then((sessionId) => {
      this.sessionId = sessionId;
      this.generateCaptcha();
    });
    this.mobileInput$.pipe(
      debounceTime(500),
      filter((mobile: any) => mobile && mobile.length === 10),
      switchMap(mobile =>
        this.masterService.isMobileNoExist(mobile))).subscribe((res: any) => {
          if (res.messageCode === 1) {
            this.mobileVerified = res.data.isMobileExist
          }
          else {
            this.openConfirm()
          }
        });
  }

  citizenForms() {
    this.citizenForm = this.fb.group({
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
      captcha: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6)
      ]]
    });
  }
  adminForms() {
    this.adminForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6)
      ]]
    });
  }

  stateForms() {
    this.stateForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6)
      ]]
    });
  }

  pdForms() {
    this.pdForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6)
      ]]
    });
  }


  async generateUUID() { // Public Domain/MIT
    let sessionIdPromise = new Promise((resolve, reject) => {
      var d = new Date().getTime();//Timestamp
      var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      return resolve('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      }));
    });
    return await sessionIdPromise;
  }
  reload() {
    this.generateCaptcha();
    this.citizenForm.get('captcha')?.reset();
    this.adminForm.get('captcha')?.reset();
    this.pdForm.get('captcha')?.reset();
  }


  generateCaptcha() {
    this.masterService.generateCaptcha().subscribe((response: any) => {
      console.log(response, "response captcha");
      this.getCaptchadata = response.data
      this.captcha = this.getCaptchadata.captcha
      this.captchaCode = this.getCaptchadata.captchaCode
      this.captchaId = this.getCaptchadata.captchaId
      sessionStorage.setItem('sessionId1', response.data.sessionId);
      this.generateImage(this.captcha)
    });
  }


  generateImage(baseImage: string) {
    const imgHtml = `
  <img src="data:image/png;base64,${baseImage}"
       alt="Captcha"
       style="height: 100%; width: 100%; border-radius: 5px;" />
`;
    const imageContainer = document.getElementById("image");
    if (imageContainer) {
      imageContainer.innerHTML = imgHtml;
    }
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


  // user type change
  toggleForm(role: string) {
    this.isCitizen = role === 'citizen';
    this.isAdmin = role === 'admin';
    this.isState = role === 'state';
    this.signInTitle = role === 'citizen' ? 'Citizen Sign in' : role === 'admin' ? 'Admin Sign in' : role === 'pd' ? 'PD Sign in' : 'State Sign in';
    // this.signInTitle = role === 'citizen' ? 'Citizen Sign In' : role === 'admin' ? 'Admin Sign In' : 'State Sign In';
    this.isSubmitted = false;
    this.isSubmittedadmin = false;
    this.isSubmittedState = false;
    this.citizenForm.reset({ role: 'citizen' });
    this.adminForm.reset({ role: 'admin' });
    this.stateForm.reset({ role: 'state' });
    this.generateCaptcha();
  }

  GetverifyCaptcha(templateRef: TemplateRef<any>) {
    this.isSubmitted = true;

    if (this.citizenForm.invalid) {
      this.citizenForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields');
      return;
    }

    const enteredCaptcha = this.citizenForm.get('captcha')?.value;

    if (!enteredCaptcha || enteredCaptcha.trim() === '') {
      this.toastr.error('Please enter captcha');
      return;
    }

    const sessionId = sessionStorage.getItem('sessionId1');
    if (!sessionId) {
      this.toastr.error('Session expired. Please refresh captcha');
      this.generateCaptcha();
      return;
    }

    const payload = {
      captcha: enteredCaptcha,
      captchaId: this.captchaId
    }

    this.masterService.verifyCaptcha(payload).subscribe({
      next: (response: any) => {
        if (response.messageCode === 1) {
          const token = response.data.token;
          const payloadData = JSON.parse(atob(token.split('.')[1]));
          const isVerified = payloadData.isVerified;
          const captchaId = payloadData.captchaId;
          const exp = payloadData.exp;
          const iat = payloadData.iat;
          if (isVerified === true) {
            this.getOtp1(templateRef);
          }
        } else {
          this.toastr.error(response.message);
          this.citizenForm.get('captcha')?.reset();
          this.generateCaptcha();
        }
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          'Invalid Captcha';
        this.toastr.error(msg);
        this.citizenForm.get('captcha')?.reset();
        this.generateCaptcha();
      }
    });
  }


  // citizen login
  cooldown: number = 0;
  timerInterval: any;
  getOtp1(templateRef: TemplateRef<any>) {
    this.isSubmitted = true;
    if (this.citizenForm.invalid) {
      this.citizenForm.markAllAsTouched();
      this.toastr.error("Citizen Form Is Invalid");
      return;
    }
    const mobileNo = this.citizenForm.get('mobile')?.value;

    const payload = {
      mobileNo: mobileNo
    }
    this.masterService.generateOtp(payload).subscribe(
      (response: any) => {
        if (response.messageCode == 1) {
          this.otpdata = response;
          this.getcooldownPeriod = response.data.cooldownPeriod;
          this.otpNumber = response.data.otp;
          this.startCooldown(this.getcooldownPeriod);
          console.log(this.otpdata, 'otpdata');
          sessionStorage.setItem('citizentoken', response.responseDesc);
          this.dialog.open(templateRef, {
            width: '350px',
            disableClose: true
          });
        }
        else {
          this.toastr.error(response.message || "Failed to generate OTP");
        }
      },
      (error: any) => {
        this.toastr.error(error.error?.errorMsg || "Something went wrong");
      }
    );
  }

  startCooldown(seconds: number) {
    this.cooldown = seconds;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }



  resendOtp() {
    const mobileNo = this.citizenForm.get('mobile')?.value;
    if (!mobileNo) {
      this.toastr.error("Mobile number is required to resend OTP");
      return;
    }

    const payload = { mobileNo: mobileNo };


    this.masterService.generateOtp(payload).subscribe(
      (response: any) => {
        if (response.messageCode === 1) {
          this.otpdata = response; // update OTP if needed
          this.toastr.success("OTP resent successfully");
          // Reset cooldown
          this.startCooldown(response.data.cooldownPeriod);
        } else {
          this.toastr.error(response.errorMsg || "Failed to resend OTP");
        }
      },
      (error: any) => {
        this.toastr.error(error.error?.errorMsg || "Something went wrong");
      }
    );
  }

  verifyOtp() {

    if (!this.otpValue || this.otpValue.length < 4) {
      this.toastr.error('Please enter valid OTP');
      return;
    }

    const payload = {
      mobileNo: this.citizenForm.get('mobile')?.value,
      otp: this.otpValue
    };
    this.masterService.verifyOtp(payload).subscribe({
      next: (response: any) => {

        if (response.messageCode !== 1 || !response.data?.token) {
          this.toastr.error(response.message || 'Invalid OTP');
          return;
        }

        // ✅ Token save
        const token = response.data.token;
        sessionStorage.setItem('accessToken', token);

        // ✅ Decode token
        const decoded = jwtDecode<UserContext>(token);
        sessionStorage.setItem('userInfo', JSON.stringify(decoded));

        // ✅ Audit log
        this.masterService.isLoggingIn = true;
        this.masterService.saveAuditLog('LOGIN', '/layout/citizen')
          .subscribe({
            complete: () => (this.masterService.isLoggingIn = false)
          });

        // ✅ Update services
        const mobile = this.citizenForm.get('mobile')?.value;
        this.mobileService.updateMobile(mobile);
        this.mobileService.updatelogindata(response);

        // ✅ UI cleanup
        this.otpValue = '';
        this.dialog.closeAll();

        // ✅ Navigate once
        this.router.navigate(['/layout/citizen']);

        this.toastr.success('Login successful');
      },

      error: (err) => {
        console.error('OTP Verify Error:', err);
        this.toastr.error(err?.error?.message || 'Something went wrong');
      }
    });
  }




  resetFormCitizen() {
    this.citizenForm.reset({ role: 'citizen' });
    this.isSubmitted = false;
  }

  onSubmitAdmin() {
    this.isSubmittedadmin = true;
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      this.toastr.error("Admin Form Is Invalid");
      return;
    }
    const enteredCaptcha = this.adminForm.get('captcha')?.value;
    if (!enteredCaptcha || enteredCaptcha.trim() === '') {
      this.toastr.error('Please enter captcha');
      return;
    }
    const payload = {
      captcha: enteredCaptcha,
      captchaId: this.captchaId
    }
    this.masterService.verifyCaptcha(payload).subscribe({
      next: (captchaRes: any) => {
          const token = captchaRes.data.token;
          const payloadData = JSON.parse(atob(token.split('.')[1]));
          const isVerified = payloadData.isVerified;
          const captchaId = payloadData.captchaId;
          const exp = payloadData.exp;
          const iat = payloadData.iat;
        if (captchaRes.messageCode === 1 && isVerified === true) {
        }
        else if (captchaRes.messageCode === 1 && isVerified === false) {
          this.toastr.error(captchaRes.message || 'Invalid Captcha');
          this.pdForm.get('captcha')?.reset();
          this.generateCaptcha();
          return;
        }
        const logindata = this.adminForm.getRawValue();
        const encryptedPassword = CryptoJS.SHA256(logindata.password.trim()).toString(CryptoJS.enc.Hex);
        const postLoginForm = {
          loginName: logindata.user,
          password: encryptedPassword
        };

        this.officer.loginFormCreate(postLoginForm).subscribe({
          next: (response: any) => {
            if (response.messageCode === 1 && response.data) {
              const token = response.data.token;
              sessionStorage.setItem('accessToken', token);
              const decodedToken: any = jwtDecode(token);
              const decoded: UserContext = jwtDecode<UserContext>(token);
              // sessionStorage.setItem('userContext',JSON.stringify(decoded));
              sessionStorage.setItem('userInfo', JSON.stringify(decoded));
              this.masterService.isLoggingIn = true;
              this.masterService
                .saveAuditLog('LOGIN', '/layout/admin/dashboard')
                .subscribe({
                  complete: () => (this.masterService.isLoggingIn = false)
                });
              this.router.navigate(['/layout/admin']);
              if (decodedToken.isExpire === true) {
                this.auth.openForceChangePasswordDialog();
              }
            } else {
              this.toastr.error(response.message || 'Login failed');
            }
          },
          error: () => {
            this.toastr.error('Login API error');
          }
        });
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid Captcha';
        this.toastr.error(msg);
        this.adminForm.get('captcha')?.reset();
        this.generateCaptcha();
      }
    });
  }

  onSubmitPD() {
    this.isSubmittedPd = true;

    if (this.pdForm.invalid) {
      this.pdForm.markAllAsTouched();
      this.toastr.error("PD Form Is Invalid");
      return;
    }
    const enteredCaptcha = this.pdForm.get('captcha')?.value;

    if (!enteredCaptcha || enteredCaptcha.trim() === '') {
      this.toastr.error('Please enter captcha');
      return;
    }
    const sessionId = sessionStorage.getItem('sessionId1');
    if (!sessionId) {
      this.toastr.error('Session expired. Please refresh captcha');
      this.generateCaptcha();
      return;
    }

    const payload = {
      captcha: enteredCaptcha,
      captchaId: this.captchaId
    }

    this.masterService.verifyCaptcha(payload).subscribe({
      next: (captchaRes: any) => {
         const token = captchaRes.data.token;
          const payloadData = JSON.parse(atob(token.split('.')[1]));
          const isVerified = payloadData.isVerified;
          const captchaId = payloadData.captchaId;
          const exp = payloadData.exp;
          const iat = payloadData.iat;
        if (captchaRes.messageCode === 1 && isVerified === true) {
        }
        else if (captchaRes.messageCode === 1 && isVerified === false) {
          this.toastr.error(captchaRes.message || 'Invalid Captcha');
          this.pdForm.get('captcha')?.reset();
          this.generateCaptcha();
          return;
        }

        const logindata = this.pdForm.getRawValue();
        const encryptedPassword = CryptoJS.SHA256(logindata.password.trim()).toString(CryptoJS.enc.Hex);
        const postLoginForm = {
          loginName: this.pdForm.get('user')?.value,
          password: encryptedPassword
        };

        console.log("Login payload:", JSON.stringify(postLoginForm));

        this.officer.loginFormCreate(postLoginForm).subscribe({
          next: (response: any) => {
            if (response.messageCode === 1) {
              const token = response.data.token;
              sessionStorage.setItem('accessToken', token);
              const decoded: UserContext = jwtDecode<UserContext>(token);
              const decodedToken: any = jwtDecode(token);
              // sessionStorage.setItem('userContext',JSON.stringify(decoded));
              sessionStorage.setItem('userInfo', JSON.stringify(decoded));
              this.masterService.isLoggingIn = true;
              this.masterService
                .saveAuditLog('LOGIN', '/layout/admin/dashboard')
                .subscribe({
                  complete: () => {
                    this.masterService.isLoggingIn = false;
                  }
                });
              this.router.navigate(['/layout/admin']);
              if (decodedToken.isExpire === true) {
                this.auth.openForceChangePasswordDialog();
              }
            } else {
              this.toastr.error(response.message || 'Login failed');
            }
          },
          error: () => {
            this.toastr.error('Login API error');
          }
        });
      },

      error: (err) => {
        const msg = err?.error?.message || 'Invalid Captcha';
        this.toastr.error(msg);
        this.pdForm.get('captcha')?.reset();
        this.generateCaptcha();
      }
    });
  }


  resetFormAdmin() {
    this.adminForm.reset({ role: 'admin' });
    this.isSubmittedadmin = false;
  }
  checkMobileNoExist() {

  }

  onMobileKeyUp() {
    const control = this.citizenForm.get('mobile');
    if (control?.valid && control?.value.length === 10) {
      this.mobileInput$.next(control.value);
    }
  }
  openConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: "Mobile Number Not Registered",
        message: "Do you want to go to registeration page?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/graviance-register'])
      } else {
        console.log("User clicked NO");
      }
    });
  }



  //// new api for state login////
  getStateMaster() {
    this.masterService.getStateMaster().subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.masterStateData = response.data;
          console.log(this.masterStateData, 'this.masterdata');

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }

  selectedScheme(event: any) {
    const selectedvalue = event?.value

  }

  ////new api for state login////
  schemeMaster() {
    this.masterService.schemeMaster().subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.getschemeList = response.data;
          console.log(this.getschemeList, 'this.masterdata');

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }

  onStateChange(event: any) {
    this.selectedState = event.value;
  }


}

