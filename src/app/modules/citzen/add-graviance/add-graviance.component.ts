import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, filter, Subject, switchMap } from 'rxjs';
import { CommonService } from '../../../services/common.service';

import { ErrorHandlerService } from '../../../shared/error-handler.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MobileService } from '../../../services/mobile.service';
import { masterService } from '../../../services/master.service';
import { takeUntil } from 'rxjs/operators';
declare var Sanscript: any;
@Component({
  selector: 'app-add-graviance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ...MATERIAL_MODULES],
  templateUrl: './add-graviance.component.html',
  styleUrl: './add-graviance.component.scss'
})
export class AddGravianceComponent implements OnInit {
  @ViewChild('saveAsPdf', { static: false }) saveAsPdf?: ElementRef;
  @ViewChild('pdfDialog') pdfDialog!: TemplateRef<any>;
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
  selectedFileName: any
  baseUrlMobileExist = "isMobileExists"
  baseUrlCitizen = 4
  citizenId: any;
  getcitizenId: any;
  mobileNo: any;
  grievanceDetails: any;
  destroy$ = new Subject<void>
  userName: any;
  isSelectedFile: any;
   isClearFile: any
  generatedComplaintId: any;
  constructor(
    private service: CommonService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private mobileService: MobileService,
    private masterService: masterService
  ) {
  }

  ngOnInit() {
    this.createForm()
    this.isComplaintSave = true;
    this.getStateList();
    this.getSchemeList();
    this.getMinistry();
    //  this.citizenDetails();
    this.mobileService.updateMobile$.subscribe(value => {
      this.mobile = value;  // bind to variable
    });
    this.mobileService.updatelogindata$.subscribe(value => {
      this.getcitizenId = value.data.citizenId;
      this.mobileNo = value.data.mobileNo;  // bind to variable
    });
    this.grievanceForm.get('mobile')?.setValue(this.mobile)
    if (this.mobile != null) {
      this.masterService.citizenDetails(this.getcitizenId, this.mobileNo).subscribe((res: any) => {
        if (res) {
          this.citzenDetails = res.data
          this.userName = res.data.name
          const data = this.citzenDetails
          // this.grievanceForm.patchValue({
          //   name: data?.name ? data?.name : '',
          //   fatherHus: data?.fatherHusbandName,
          //   stateCode: data[0]?.stateCode ? data[0]?.stateCode : '',
          //   districtCode: data[0]?.districtCode ? data[0]?.districtCode : '',
          //   blockCode: data[0]?.blockCode ? data[0]?.blockCode : '',
          //   gpCode: data[0]?.panchayatCode ? data[0]?.panchayatCode : '',
          //   villageCode: data[0]?.villageCode ? data[0]?.villageCode : '',
          //   gender: data[0]?.gender === "undefined" ? "null" : data[0]?.gender,
          //   pinCode: data[0]?.pincode,
          //   ministry: data[0]?.ministry ? data[0]?.ministry : this.ministry
          // })
          this.grievanceForm.patchValue(data)


          const disableFields = ['name', 'fatherHusbandName', 'gender', 'mobile'];

          disableFields.forEach(field => {
            const control = this.grievanceForm.get(field);
            const value = control?.value;

            if (value && value !== 'undefined') {
              control?.disable();
            } else {
              control?.enable();
              control?.setValue('');
            }
          });

          this.stateCode = data.stateCode;
          this.getDistrictList();
          this.districtCode = data.districtCode;
          this.getBlockList();
          this.blockCode = data.blockCode;
          this.getGpList();
          this.gpCode = data.panchayatCode;
          this.getVillageList();
        }
      })
    }
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
    this.initSpeech();

    this.generateUUID().then((sessionId) => {
      this.sessionId = sessionId;
      this.generateCaptcha();
    });

    this.mobileInput$
      .pipe(
        debounceTime(500),
        filter((mobile: any) => mobile && mobile.length === 10),
        switchMap(mobile =>
          this.service.isMobileNoExist(this.baseUrlMobileExist, mobile)
        )
      )
      .subscribe((res: any) => {
        if (res.exists === true) {
          this.openConfirm()
          this.grievanceForm.get('mobile')?.reset('', { emitEvent: false });
          this.grievanceForm.get('mobile')?.markAsUntouched()
          this.grievanceForm.get('mobile')?.updateValueAndValidity()
        }
        if (res.exists === false) {

        }
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

  createForm() {
    this.grievanceForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      fatherHusbandName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      stateCode: ['', Validators.required],
      districtCode: ['', Validators.required],
      blockCode: ['', Validators.required],
      panchayatCode: ['', Validators.required],
      villageCode: [''],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      address: [''],
      ministry: ['', Validators.required],
      schemeCode: ['', Validators.required],
      Description: ['', [Validators.required, Validators.maxLength(250)]],
      Language: ['en-IN', Validators.required],
      captcha: ['', [Validators.required]],
      attachMent1: []
    });
  }

  get f() {
    return this.grievanceForm.controls as { [key: string]: any };
  }

  startVoiceInput() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  onLanguageChange(event: MatSelectChange) {
    const selected = event.value;
    this.grievanceForm.get('Language')?.setValue(selected);
    this.selectedLanguage = selected;
    if (this.recognition) {
      this.recognition.lang = selected;
    }
  }


  reload() {
    this.generateCaptcha();
  }

  getCaptchadata: any;
  captchaCode: any;
  generateCaptcha() {
    this.masterService.generateCaptcha().subscribe((response: any) => {
      console.log(response, "response captcha");
      this.getCaptchadata = response.data
      this.captcha = this.getCaptchadata.captcha
      this.captchaCode = this.getCaptchadata.captchaCode
      sessionStorage.setItem('sessionId1', response.data.sessionId);
      this.generateImage(this.captcha)
    });
  }
  generateImage(baseImage: string) {
    const imgHtml = `
  <img src="data:image/png;base64,${baseImage}"
       alt="Captcha"
       style="height: 100%; width: 180px; object-fit: contain; border-radius: 5px;" />
`;
    const imageContainer = document.getElementById("image");
    if (imageContainer) {
      imageContainer.innerHTML = imgHtml;
    }
  }



  selectedMinister(event: any) {
    const valuename = event.value
  }

  getMinistry() {
    this.masterService.getMinistry().subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.ministryList = response.data.filter(
          (item: any) => item.ministryCode === 1
        );
          console.log(this.ministry, "ministry");
        } else {
          console.error('Failed to load ministry list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading ministry list')
    });
  }

  getSchemeList() {
    this.masterService.schemeMaster().subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.schemeList = response.data;
        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
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

  getStateList() {
    this.masterService.getStateMaster().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1 && response?.data?.length) {
          this.stateList = response.data;
        } else {
          console.error('Failed to load state list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading state list')
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
  schemeName: any
  fileName: string | null = null;
  checkUpLoadedAttachmentFormat(e: any, attachNo: any) {
    const allowedExtensions = ["pdf", "jpeg", "jpg", "png"];
    const maxSizeInBytes = 10 * 1024 * 1024; // 1MB in bytes

    const file: File = e.target.files?.[0];

    if (!file) {
      alert("No file selected.");
      return false;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      alert("Selected File Type is Wrong. Only jpeg/png/pdf files are allowed.");
      this.attachement1 = null;
      const input = document.getElementById(`attachment_${attachNo}_id`) as HTMLInputElement;
      if (input) input.value = '';
      return false;
    }

    if (file.size > maxSizeInBytes) {
      alert("File size should be less than 10 MB.");
      this.attachement1 = null;
      const input = document.getElementById(`attachment_${attachNo}_id`) as HTMLInputElement;
      if (input) input.value = '';
      return false;
    }

    // Valid file
    this.attachement1 = file;
    this.fileName = file.name
    console.log(this.attachement1, "filepath");

    // this.grievanceForm.get('attachMent1')?.setValue(this.attachement1)
    return true;
  }
  clearFile(fileInput: HTMLInputElement) {
    fileInput.value = '';     // reset input
    this.fileName = null;     // clear name
    this.attachement1 = null;
  }

previewSelectedFile() {
  if (!this.attachement1) return;
  const fileURL = URL.createObjectURL(this.attachement1);
  window.open(fileURL, '_blank');

  setTimeout(() => {
    URL.revokeObjectURL(fileURL);
  }, 1000);
}

  isSubmitted = false; // to track submit click


  onSubmit() {
    this.isSubmitted = true;
    if (this.grievanceForm.invalid) {
      this.grievanceForm.markAllAsTouched();
      return;

    }
    this.grievanceForm.enable()
    const formValue = this.grievanceForm.value;
    // const formData = new FormData();
    // // if (formValue.attachMent1 instanceof File) {
    // //   formData.append('attachMent1', formValue.attachMent1, formValue.attachMent1.name);
    // // }
    // let fileName = '';
    // let filePath = '';
    // if (formValue.attachMent1 instanceof File) {
    //   const file: File = formValue.attachMent1;
    //   fileName = file.name;                 // actual uploaded file name
    //   filePath = `/uploads/${file.name}`;   // or whatever path backend expects
    //   formData.append('attachMent1', file, file.name);
    // }
    // const payload = {
    //   citizenId: this.citzenDetails?.citizenId,
    //   stateCode: this.grievanceForm.get('stateCode')?.value,
    //   districtCode: this.grievanceForm.get('districtCode')?.value,
    //   blockCode: this.grievanceForm.get('blockCode')?.value,
    //   panchayatCode: this.grievanceForm.get('panchayatCode')?.value,
    //   villageCode: this.grievanceForm.get('villageCode')?.value,
    //   pinCode: this.grievanceForm.get('pinCode')?.value,
    //   ministryCode: this.grievanceForm.get('ministry')?.value,
    //   schemeCode: this.grievanceForm.get('schemeCode')?.value,
    //   description: this.grievanceForm.get('Description')?.value,
    //   fileName: fileName,
    //   filePath: filePath,
    //   createdBy: this.citzenDetails?.citizenId
    // }
    // const formData = new FormData();
    //   formData.append('citizenId', this.citzenDetails?.citizenId);
    //   formData.append('stateCode', this.grievanceForm.get('stateCode')?.value);
    //   formData.append('districtCode', this.grievanceForm.get('districtCode')?.value);
    //   formData.append('blockCode', this.grievanceForm.get('blockCode')?.value);
    //   formData.append('panchayatCode', this.grievanceForm.get('panchayatCode')?.value);
    //   formData.append('villageCode', this.grievanceForm.get('villageCode')?.value);
    //   formData.append('pinCode', this.grievanceForm.get('pinCode')?.value);
    //   formData.append('ministryCode', this.grievanceForm.get('ministry')?.value);
    //   formData.append('schemeCode', this.grievanceForm.get('schemeCode')?.value);
    //   formData.append('description', this.grievanceForm.get('Description')?.value);
    //   formData.append('createdBy', this.citzenDetails?.citizenId);

    //   // Append file if selected
    //   if (this.attachement1) {
    //     formData.append('attachMent1', this.attachement1, this.attachement1.name);
    //   }
    const formData = new FormData();
  // 1️⃣ JSON object exactly like Postman
  const payload = {
    citizenId: this.citzenDetails?.citizenId,
    stateCode: this.grievanceForm.get('stateCode')?.value,
    districtCode: this.grievanceForm.get('districtCode')?.value,
    blockCode: this.grievanceForm.get('blockCode')?.value ,
    panchayatCode: this.grievanceForm.get('panchayatCode')?.value || '',
    villageCode: this.grievanceForm.get('villageCode')?.value,
    pinCode: this.grievanceForm.get('pinCode')?.value,
    ministryCode: this.grievanceForm.get('ministry')?.value,
    schemeCode: this.grievanceForm.get('schemeCode')?.value,
    description: this.grievanceForm.get('Description')?.value,
    createdBy: this.citzenDetails?.citizenId
    };
    formData.append('data',new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (this.attachement1) {
      formData.append('file', this.attachement1);
    }

    // 4️⃣ Call your API
    this.masterService.saveGrievance(formData).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1) {
          this.grievanceDetails = response.data;
          this.generatedComplaintNo = response.data.grievanceNumber ;
           this.generatedComplaintId = response.data.grievanceId;
          // this.name = this.grievanceForm.get('name')?.value
          this.schemeName = this.grievanceForm.get('schemeCode')?.value;
          const selectedScheme = this.schemeList.find(
            item => item.schemeCode === this.schemeName
          );
          if (selectedScheme) {
            this.schemeName = selectedScheme.schemeName;   // <-- Get the name
          }
          // this.grievanceForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
          this.isSubmitted = false;
          this.isComplaintSave = false;
          this.grievanceForm.reset();
          setTimeout(() => {
            this.toastr.success(response?.message || 'Grievance saved successfully!');
            this.openPdfModal();
          }, 300);
        } else {
          this.toastr.warning(response?.message || 'Something went wrong, please try again.');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(err, 'Grievance not saved');
        this.toastr.error('Unable to save grievance. Please try again later.');
      }
    });

  }
  resetForm() {
    this.isSubmitted = false;
    // this.grievanceForm.get('schemeCode')?.setValue('')
    // this.grievanceForm.get('Description')?.setValue('')
    // this.grievanceForm.get('captcha')?.setValue('')
    // this.grievanceForm.get('attachMent1')?.setValue('')
    //this.reload()
    this.grievanceForm.reset();
    this.grievanceForm.updateValueAndValidity()
  }
  dialogRef: any;
  openPdfModal() {
    this.dialogRef = this.dialog.open(this.pdfDialog, {
      width: '1000px',
      maxWidth: '100%',  // allow full width
      disableClose: true
    });
  }
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
        this.router.navigate(['/layout/citizen/graviance-list'])
    }
  }
  initSpeech() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.selectedLanguage;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onstart = () => (this.micActive = true);
    this.recognition.onend = () => {
      this.micActive = false;
    };

    // 🚀 IMPORTANT FIX — Angular Zone ke andar result set karna
    this.recognition.onresult = (event: any) => {
      this.ngZone.run(() => {
        const transcript = event.results[0][0].transcript;
        const current = this.grievanceForm.get('Description')?.value || '';

        this.grievanceForm.patchValue({
          Description: (current + ' ' + transcript).trim()
        });

        console.log("AFTER SET:", this.grievanceForm.get('Description')?.value);
      });
    };

    this.recognition.onerror = (e: any) => {
      console.error("Speech error:", e);
      this.micActive = false;
    };
  }

  message: any = ""

  toggleMic() {

    if (!this.recognition) return;
    if (this.micActive) {
      try { this.recognition.stop(); } catch { }
      this.micActive = false;
      return;
    }

    // Start
    const lang = this.grievanceForm.get("Language")?.value;
    this.recognition.lang = lang;
    try {
      this.recognition.start();
      this.micActive = true;
    } catch { }
  }

  // ---------------- TRANSLITERATION ----------------
  private getScript(langCode: string): string {
    return {
      'en-IN': 'english',
      'hi-IN': 'devanagari',
      'bn-IN': 'bengali',
      'ta-IN': 'tamil',
      'te-IN': 'telugu',
      'gu-IN': 'gujarati',
      'ml-IN': 'malayalam',
      'mr-IN': 'devanagari',
      'kn-IN': 'kannada',
      'pa-IN': 'gurmukhi',
    }[langCode] || 'english';
  }

  transliterateOnType(event: Event) {
    if (this.micActive) return;  // 🎤 mic mode = No transliteratio
    const raw = (event.target as HTMLTextAreaElement).value;
    const lang = this.grievanceForm.get('Language')?.value;
    const script = this.getScript(lang);
    if (!Sanscript?.schemes?.[script]) return;
    const converted = Sanscript.t(raw, "itrans", script);
    this.grievanceForm.patchValue({ Description: converted });
  }

  previousRaw = "";

  // Call this from (input)

  generatePdf() {
    if (!this.saveAsPdf) {
      console.error('saveAsPdf is undefined!');
      return;
    }
    const element = this.saveAsPdf.nativeElement;
    html2canvas(element, { scale: 0.7 }).then(canvas => {

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;  // left-right margin = 10mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 10; // top margin

      // Add image — if content is longer than 1 page, split into multiple pages
      if (imgHeight < pageHeight) {
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          if (heightLeft > 0) {
            pdf.addPage();
            position = 10;
          }
        }
      }

      pdf.save(`Grievance_${this.generatedComplaintNo}.pdf`);
    });
  }
  ngOnDestroy(): void {
    try { this.recognition?.stop(); } catch { }
    if (this.recognition) {
      try { this.recognition.stop(); } catch { }
    }
    this.micActive = false;
    this.destroy$.complete()

  }
  openConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: "Mobile Number Already Registered",
        message: "Do you want to go to the login page?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/login'])
      } else {
        console.log("User clicked NO");
      }
    });
  }

  // getStateMaster() {
  //   this.masterService.getStateMaster().subscribe({
  //     next: (response: any) => {
  //       if (response?.messageCode === 1 && response?.data?.length) {
  //         this.masterStateData = response.data;
  //         console.log(this.masterStateData, 'this.masterdata');

  //       } else {
  //         console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
  //   });
  // }


}
