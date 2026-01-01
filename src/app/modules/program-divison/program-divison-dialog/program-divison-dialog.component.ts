import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatTableDataSource } from '@angular/material/table';
import { masterService } from '../../../services/master.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { A11yModule } from "@angular/cdk/a11y"; // <-- Add this
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';



@Component({
  selector: 'app-program-divison-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ...MATERIAL_MODULES, ReactiveFormsModule, FormsModule, A11yModule],
  templateUrl: './program-divison-dialog.component.html',
  styleUrl: './program-divison-dialog.component.scss'
})
export class ProgramDivisonDialogComponent {
  displayedColumns: string[] = ['serialNo', 'grievanceId', 'schemeName', 'ministryName', 'stateName', 'districtName', 'blockNameName', 'pinCode', 'villageName', 'panchayatName', 'description', 'attachment']; // columns you want
  dataSource!: MatTableDataSource<any>;
  grievancedetails: any;
  citizendetails: any;
  feedbackComments: string = '';
  citizenSatisfaction: string = '';
  citizenFeedback: string = '';
  citizenComment: string = '';
  grievanceId: any;
  citizenId: any;
  citzenDetails: any;
  pdRemarks: string = '';
  pdStatus: string = '';
  commentsAttachments: any;
  userInfo: any;
  parsedUserInfo: any;
  userCode: any;
  loginName: any;
  showForwardFields = false;
  selectedScheme: string = '';
  getschemeList: any;
  officeStatusDetails: any;
  userType: any;
  selectedSataus: any;
  selectedscheme: any;
  feedbackForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private masterService: masterService,
    private toastr: ToastrService, private errorHandler: ErrorHandlerService, private dialogRef: MatDialogRef<ProgramDivisonDialogComponent>, private fb: FormBuilder) {
    console.log(data, "data");
    this.citizendetails = data.citizen
    this.grievancedetails = data.grievance
    this.grievanceId = this.grievancedetails.grievanceId
    this.citizenId = this.grievancedetails.citizenId
    // this.grievancedetails = {
    //   ...data.grievance,
    //   fileUrl: 'http://localhost:4200/' + data.grievance.filePath
    // };
    this.dataSource = new MatTableDataSource([this.grievancedetails]);
  }

  ngOnInit() {
    this.getCitizenDetails();
    // Initialize the table data
    // this.dataSource = new MatTableDataSource(this.data); 
    // Assuming your data is like { items: [ {id:1, name:'a', description:'b'} ] }

    this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
    }

    this.officeStatus();
    this.myForm();

  }

  myForm() {
    this.feedbackForm = this.fb.group({
      citizenComment: [
        '',
        [Validators.required, Validators.maxLength(1000)]
      ],
      status: ['', Validators.required],
      schemeType: ['']
    });
  }

  downloadFile(filePath: string, fileName: string) {
    const link = document.createElement('a');
    link.href = filePath; // full URL if backend hosted separately
    link.download = fileName;
    link.click();
  }


  getCitizenDetails() {
    if (this.citizenId && this.grievanceId) {
      this.masterService
        .getcommentsaAttachments(this.citizenId, this.grievanceId)
        .subscribe((res: any) => {
          if (res.messageCode === 1) {
            this.citizendetails = res.data;
            this.commentsAttachments = res.data.grievanceDetails.commentsAttachments;
            console.log(this.commentsAttachments, "commentsAttachments");

          }
        });
    }
  }



  submitFeedback() {
    debugger
    const formData = new FormData();
    let payload: any = {
      grievanceId: this.grievanceId,
      grievanceNumber: this.grievancedetails.grievanceNumber,
      comments: this.feedbackForm.get('citizenComment')?.value || '',
      status: this.selectedSataus || '',
      commentsBy: this.loginName,
      createdBy: this.loginName,
      ...(this.userType === 1 &&this.selectedSataus === 'F' && this.selectedscheme && {schemeCode: this.selectedscheme})
    };


    formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (this.attachement1) {
      formData.append('file', this.attachement1);
    }
    this.masterService.commentsAttachments(formData)
      .subscribe({
        next: (res: any) => {
          if (res.messageCode === 1) {
            this.citizendetails = res.data;
            this.toastr.success(res?.message || 'Comment saved successfully');
          }
        },
        error: (err) => console.error('API Error:', err)
      });
  }



  openAttachment(fileName: string): void {
    // this.reviewUpdateStatusService.viewAttachment(fileName).subscribe({
    //   next: (res: Blob) => {
    //     const url = window.URL.createObjectURL(res);
    //     window.open(url, '_blank'); // Open in a new tab
    //   },
    //   error: (err) => {
    //     swal({
    //       icon: 'error',
    //       title: 'File Not Found',
    //       text:
    //         err.error?.message ||
    //         "Document doesn't exist. Please contact administrator.",
    //     });
    //   },
    // });
  }


  // submitFeedback(){}

  //   submitFeedback() {
  //   if (!this.citizenSatisfaction) {
  //     swal('Please select satisfaction status');
  //     return;
  //   }

  //   const payload = {
  //     citizenComment: this.citizenComment,
  //     citizenSatisfaction: this.citizenSatisfaction,
  //   };

  //   this.userDetailService
  //     .submitCitizenFeedback(this.popupGrievance.grievanceNumber, payload)
  //     .subscribe({
  //       next: () => {
  //         swal('Success', 'Feedback submitted successfully!', 'success');
  //         this.citizenComment = '';
  //         this.citizenSatisfaction = '';
  //         this.showPopup = false;
  //       },
  //       error: () => {
  //         swal('Error', 'Unable to save feedback', 'error');
  //       },
  //     });
  // }

  attachement1: any = File
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


  officeStatus() {
    const role =
      this.userType === 1 ? 'ADMIN' :
        this.userType === 2 ? 'PD' :
          '';
    this.masterService.getOfficerStatusDetail(role).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1) {
          console.log(response.data, "response");
          this.officeStatusDetails = response.data

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }


  selectedStatus(event: any) {
    debugger
    this.selectedSataus = event?.value

    this.showForwardFields = this.selectedSataus === 'F';

    if (this.showForwardFields) {
      // this.loadAllPDs();
      this.schemeMaster();
    }

  }


  selectedschemeList(event: any) {
    debugger
    this.selectedscheme = event?.value


    if (this.showForwardFields) {
      // this.loadAllPDs();
      this.schemeMaster();
    }

  }




}
