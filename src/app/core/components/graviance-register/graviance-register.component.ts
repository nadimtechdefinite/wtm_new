import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../shared/error-handler.service';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatSelectChange } from '@angular/material/select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, filter, of, Subject, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { masterService } from '../../../services/master.service';
import { NumberOnlyDirective } from '../../../shared/directives/numberonly.directive';
import { error } from 'highcharts';

declare var Sanscript: any;


@Component({
  selector: 'app-graviance-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ...MATERIAL_MODULES,NumberOnlyDirective ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './graviance-register.component.html',
  styleUrl: './graviance-register.component.scss'
})
export class GravianceRegisterComponent implements OnInit {
  @ViewChild('saveAsPdf', { static: false }) saveAsPdf?: ElementRef;
  @ViewChild('pdfCard') pdfCard!: ElementRef;
  mobileInput$ = new Subject<string>();

  grievanceForm!: FormGroup;
  isComplaintSave: boolean = true;
  isalreadyExist: any = false;
  stateList: any[] = [];
  districtList: any[] = [];
  blockList: any[] = [];
  gpList: any[] = [];
  villageList: any[] = [];
  ministryList: any[] = [];
  schemeList: any[] = [];
  sessionId: any = "";
  ministry = "0";
  schemeCode = "0";
  name: any;
  gender: any;
  stateCode: any;
  districtCode: any;
  blockCode: any;
  gpCode: any;
  villageCode: any;
  mobile: any;
  captcha: any;
  Description: any;
  enteredOtp: any;
  attachement1: any = File
  complaintSubCategeoryList: any = [];
  generatedComplaintNo: any;
  recognition: any;
  currentDate: Date = new Date();
  micActive = false;
  citzenDetails: any
  selectedLanguage = 'en-IN';
  selectedFileName: any;
  message: any = ""
  // baseUrlMobileExist = "isMobileExists"
  schemeName: any
  masterdata: any;
  registerData: any;
  isMobileExist: any;
  getCaptchadata: any;
  captchaCode: any;
  captchaId:any;
  constructor(
    private service: CommonService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private masterService: masterService,
    private router: Router) {
  }

  ngOnInit() {
    this.createForm()
    this.isComplaintSave = true;
    this.getStateMaster();
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        this.Description = transcript; // Update the Description model with the speech text
      };
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.error('Speech Recognition API is not supported in this browser.');
    }
    this.isalreadyExist = sessionStorage.getItem('isalreadyExist');
    this.generateUUID().then((sessionId) => {
      this.sessionId = sessionId;
      this.generateCaptcha();
    });

    this.mobileInput$
      .pipe(
        debounceTime(500),
        filter((mobile: any) => mobile && mobile.length === 10),
        switchMap(mobile =>
          this.masterService.isMobileNoExist(mobile)
        )
      )
      .subscribe((res: any) => {
        if (res.messageCode === 1) {
          console.log(res, "res");
          this.isMobileExist = res.data.isMobileExist
          this.openConfirm()
          this.grievanceForm.get('mobile')?.reset('', { emitEvent: false });
          this.grievanceForm.get('mobile')?.markAsUntouched()
          this.grievanceForm.get('mobile')?.updateValueAndValidity()
        }
        if (res.messageCode === false) {

        }
      });
  }

  onMobileKeyUp() {
    const control = this.grievanceForm.get('mobile');
    if (control?.valid && control?.value.length === 10) {
      this.mobileInput$.next(control.value);
    }
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


  createForm() {
    this.grievanceForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      fatherHus: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      stateCode: ['', Validators.required],
      districtCode: ['', Validators.required],
      blockCode: ['', Validators.required],
      gpCode: ['', Validators.required],
      villageCode: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      address: [''],
      captcha: ['', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(6)
  ]],
    });
  }

  get f() {
    return this.grievanceForm.controls as { [key: string]: any };
  }

  reload() {
    this.generateCaptcha();
    this.grievanceForm.get('captcha')?.reset();
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
       style="height: 100%; width: 100%; contain; border-radius: 5px;" />
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

  onStateChange(event: any) {
    this.stateCode = event.value;
    this.grievanceForm.patchValue({ districtCode: '', blockCode: '', gpCode: '', villageCode: '' }, { emitEvent: false });
    [this.districtList, this.blockList, this.gpList, this.villageList] = [[], [], [], []];
    this.getDistrictList();
  }

  onDistrictChange(event: any) {
    this.districtCode = event.value;
    this.grievanceForm.patchValue({ blockCode: '', gpCode: '', villageCode: '' }, { emitEvent: false });
    [this.blockList, this.gpList, this.villageList] = [[], [], []];
    this.getBlockList()
  }
  onBlockChange(event: any) {
    this.blockCode = event.value;
    this.grievanceForm.patchValue({ gpCode: '', villageCode: '' }, { emitEvent: false });
    [this.gpList, this.villageList] = [[], []];
    this.getGpList()
  }
  onGpChange(event: any) {
    this.gpCode = event.value;
    this.getVillageList()
  }

  // GetverifyCaptcha() {
  //   const sessionId = sessionStorage.getItem('sessionId1');

  //   if (!sessionId) {
  //     console.error('Session ID not found');
  //     return;
  //   }
  //   this.masterService.verifyCaptcha(this.captchaCode).subscribe((response: any) => {
  //     if (response.messageCode === 1) {
  //       this.onSubmit();
  //     }
  //   });
  // }



  GetverifyCaptcha() {
  if (!this.captcha || this.captcha.trim() === '') {
    this.toastr.error('Please enter captcha');
    return;
  }

  const sessionId = sessionStorage.getItem('sessionId1');
  if (!sessionId) {
    this.toastr.error('Session expired. Please refresh captcha');
    this.generateCaptcha();
    return;
  }

  const enteredCaptcha = this.grievanceForm.get('captcha')?.value;

  if (!enteredCaptcha || enteredCaptcha.trim() === '') {
    this.toastr.error('Please enter captcha');
    return;
  }

  const payload = {
    captcha: enteredCaptcha,
    captchaId: this.captchaId
  }

  this.masterService.verifyCaptcha(payload).subscribe({
     next: (response: any) => {
    if (response.messageCode === 1) {
      this.onSubmit();
    } 
  },
  error: (err) => {
    console.log('Full error:', err);
    const message =
      err?.error?.message ||   // backend message
      err?.message ||          // angular message
      'Captcha verification failed';
      this.toastr.error(message);
      this.captchaCode = '';
      this.generateCaptcha();
  }
  });
}
isSubmitted = false;

onSubmit() {
  this.isSubmitted = true;

  if (this.grievanceForm.invalid) {
    this.grievanceForm.markAllAsTouched();
    return;
  }

  const formData = {
    name: this.grievanceForm.get('name')?.value,
    fatherHusbandName: this.grievanceForm.get('fatherHus')?.value,
    gender: this.grievanceForm.get('gender')?.value,
    mobileNo: this.grievanceForm.get('mobile')?.value,
    stateCode: this.grievanceForm.get('stateCode')?.value,
    districtCode: this.grievanceForm.get('districtCode')?.value,
    blockCode: this.grievanceForm.get('blockCode')?.value,
    panchayatCode: this.grievanceForm.get('gpCode')?.value,
    villageCode: this.grievanceForm.get('villageCode')?.value,
    pinCode: this.grievanceForm.get('pinCode')?.value,
    address: this.grievanceForm.get('address')?.value,
    deviceType: 'WEB'
  };

  this.masterService.grievanceregister(formData).subscribe({
    next: (response: any) => {
      if (response?.messageCode === 1) {
        this.registerData = response.data;
        this.grievanceForm.reset();
        this.captchaCode = '';
        this.toastr.success(response?.message || 'Grievance saved successfully!');
        this.isSubmitted = false;
        this.openConfirmAfterRegister();
        this.generateCaptcha();
      } else {
        this.toastr.warning(response?.message || 'Something went wrong');
      }
    },
    error: (err: HttpErrorResponse) => {
      this.errorHandler.handleHttpError(err, 'Grievance not saved');
      this.toastr.error('Unable to save grievance. Please try again later.');
    }
  });
}

openConfirmAfterRegister() {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '380px',
    disableClose: true,
    data: {
      title: 'Citizen has been Successfully Registerd',
      yesText: 'OK',
      flag: "citizenRegister"
      // noText: 'Close'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // this.router.navigate(['/login']) 
    } else {
      // NO clicked
      console.log('User closed dialog');
    }
  });
}






  resetForm() {
    this.isSubmitted = false;
    this.grievanceForm.reset();
    this.grievanceForm.updateValueAndValidity()
  }


  ngOnDestroy(): void {
    try { this.recognition?.stop(); } catch { }
    if (this.recognition) {
      try { this.recognition.stop(); } catch { }
    }
    this.micActive = false;
  }
  openConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: "Mobile Number Already Registered",
        message: "Already registered? Please go to the login page to continue."
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/login'],
          {
            queryParams: { isMobileExist: this.isMobileExist }
          });
      } else {
        console.log("User clicked NO");
      }
    });
  }


  getStateMaster() {
    this.masterService.getStateMaster().subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.masterdata = response.data;
          console.log(this.masterdata, 'this.masterdata');

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }

  getDistrictList() {
    this.masterService.getDistritcList(this.stateCode).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.districtList = response.data;

        } else {
          console.error('Failed to load district list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading district list')
    });
  }


  getBlockList() {
    this.masterService.getBlockList(this.stateCode, this.districtCode).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.blockList = response.data;
        } else {
          console.error('Failed to load block list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading block list')
    });
  }

  getGpList() {
    this.masterService.panchayatmaster(this.stateCode, this.districtCode, this.blockCode).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.gpList = response.data;
          console.log(this.gpList, "gpList");

        } else {
          console.error('Failed to load GP list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading GP list')
    });
  }

  getVillageList() {
    this.masterService.getVillageList(this.stateCode, this.districtCode, this.blockCode, this.gpCode).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.villageList = response.data;
        } else {
          console.error('Failed to load village list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading village list')
    });
  }

  onPinInput() {
  const control = this.grievanceForm.get('pinCode');
  if (!control) return;

  let value = control.value || '';

  // remove non-numbers
  value = value.replace(/[^0-9]/g, '');

  // remove leading 0
  if (value.startsWith('0')) {
    value = value.substring(1);
  }

  // max 6 digits
  if (value.length > 6) {
    value = value.slice(0, 6);
  }

  control.setValue(value, { emitEvent: false });
}


}


