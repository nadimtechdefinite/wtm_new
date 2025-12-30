import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatTableDataSource } from '@angular/material/table';
import { masterService } from '../../../services/master.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from "@angular/cdk/a11y"; // <-- Add this
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-program-divison-dialog',
  standalone: true,
   imports: [CommonModule, MatDialogModule, ...MATERIAL_MODULES, ReactiveFormsModule, FormsModule, A11yModule],
  templateUrl: './program-divison-dialog.component.html',
  styleUrl: './program-divison-dialog.component.scss'
})
export class ProgramDivisonDialogComponent {
 displayedColumns: string[] = ['grievanceId', 'schemeName', 'ministryName', 'stateName', 'districtName', 'blockNameName', 'pinCode', 'villageName', 'panchayatName', 'description', 'attachment']; // columns you want
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private masterService: masterService, private toastr: ToastrService,) { 
    console.log(data, "data");
   this.citizendetails = data.citizen
   this.grievancedetails = data.grievance
   this.grievanceId  = this.grievancedetails.grievanceId
   this.citizenId  = this.grievancedetails.citizenId
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
      debugger
       this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userCode, "this.userCode");
      
     }
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
             this.commentsAttachments =  res.data.grievanceDetails.commentsAttachments;
             console.log(this.commentsAttachments, "commentsAttachments");

           }
         });
     }
   }


  //   submitFeedback() {
  //     const formData = new FormData();
  //     formData.append("grievanceId", this.grievanceId);
  //     formData.append("grievanceNumber", this.grievancedetails.grievanceNumber);
  //     formData.append("comments", this.pdRemarks || '');
  //     formData.append("status", this.pdStatus || '');
  //     formData.append("commentsBy", "PD");
  //     formData.append("createdBy", "PD");
  //     const data={
  //       ...formData
  //     }
  //      this.masterService.commentsAttachments(data)
  //        .subscribe((res: any) => {
  //          if (res.messageCode === 1) {
  //            this.citizendetails = res.data;
  //          }
  //        });
  //  }
submitFeedback() {
  const formData = new FormData();
  // 1️⃣ JSON object exactly like Postman
  const payload = {
    grievanceId: this.grievanceId,
    grievanceNumber: this.grievancedetails.grievanceNumber,
    comments: this.pdRemarks || '',
    status: this.pdStatus || '',
    commentsBy: this.loginName,
    createdBy: this.userCode
  };
  formData.append('data',new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (this.attachement1) {
    formData.append('file', this.attachement1);
  }
  this.masterService.commentsAttachments(formData)
    .subscribe({
      next: (res: any) => {
        if (res.messageCode ===1) {
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
}
