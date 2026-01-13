import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { masterService } from '../../../services/master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-graviance-detail-dialog',
  standalone: true,

  imports: [CommonModule, MatDialogModule, ...MATERIAL_MODULES, ReactiveFormsModule, FormsModule, A11yModule, ɵEmptyOutletComponent],
  templateUrl: './graviance-detail-dialog.component.html',
  styleUrl: './graviance-detail-dialog.component.scss'
})
export class GravianceDetailDialogComponent {
  StatusdisplayedColumns: string[] = ['srNo', 'adminMsg', 'date', 'status', 'attachment'];
  displayedColumns: string[] = ['grievanceId', 'schemeName', 'ministryName', 'stateName', 'districtName', 'blockNameName', 'panchayatName', 'villageName', 'pinCode', 'description', 'Transcript', 'attachment']; // columns you want
  dataSource!: MatTableDataSource<any>;
  dataSourceStatus = new MatTableDataSource<any>([
    {
      date: '10/01/2016',
      adminMsg: 'Verification is in progress',
      feedbackComments: 'test',
      status: 'In Progress',
      attachment: 'View PDF',

    },
    {

      date: '10/01/2016',
      adminMsg: 'Your issue has been resolved successfully',
      status: 'Completed',
      attachment: 'View PDF',
    }
  ]);
  grievancedetails: any;
  citizendetails: any;
  feedbackComments: string = '';
  citizenSatisfaction: string = '';
  citizenFeedback: string = '';
  citizenComment: string = '';
  grievanceStatus: any;
  satisfiedStatus: string = '';
  feedbackForm!: FormGroup;
  officeStatusDetails: any;
  getFeebbackSatisfied: any;
  citizenId: any;
  isSubmitted: boolean = false;
  chatData: any;
  hasSatisfied: any;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private masterService: masterService,
    private toastr: ToastrService,) {
    this.citizendetails = data.citizen
    this.citizenId = data.citizen.citizenId
    this.grievancedetails = data.grievance
    this.grievanceStatus = data.grievance.status
    this.dataSource = new MatTableDataSource([this.grievancedetails]);
  }

  ngOnInit() {
    // this.dataSource = new MatTableDataSource(this.data); 
    this.feedbackForm = this.fb.group({
      feedback: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
      satisfiedStatus: ['', Validators.required]
    });
    this.feedbackStatus();
    this.Citizenhistory();
  }

  get f() {
    return this.feedbackForm.controls;
  }

  selectedSatisfied(event: any) {
    this.getFeebbackSatisfied = event.value
  }

  downloadFile(filePath: string, fileName: string) {
    const link = document.createElement('a');
    link.href = filePath; // full URL if backend hosted separately
    link.download = fileName;
    link.click();
  }

  submitFeedback() {
    this.isSubmitted = true;
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }
    const payload = {
      citizenId: this.citizenId,
      grievanceId: this.grievancedetails?.grievanceId,
      grievanceNumber: this.grievancedetails?.grievanceNumber,
      feedbackComments: this.feedbackForm.get('feedback')?.value,
      feedbackStatus: this.getFeebbackSatisfied,
    };

    this.masterService.submitCitizenFeedback(payload).subscribe({
      next: (res: any) => {
        if (res.messageCode === 1) {
          this.toastr.success(res.message);
        }
      },
      error: () => {
      },
    });
  }




  Citizenhistory() {
  const grievanceId = this.grievancedetails?.grievanceId;

  this.masterService.Citizenhistory(grievanceId).subscribe({
    next: (res: any) => {
      if (res.messageCode === 1) {
        this.chatData = res.data;
       this.hasSatisfied = this.chatData.find(
  (item: any) => item?.citizenFeedback?.status === 'S'
);
        console.log('Chat Data:', this.chatData);
        console.log('Any Satisfied Citizen:', this.hasSatisfied.citizenFeedback.status);
      }
    },
    error: (err) => {
      console.error('Error fetching citizen history', err);
    },
  });
}

  


  feedbackStatus() {
    const role = 'FEEDBACK'
    this.masterService.feedbackStatusDetail(role).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1) {
          console.log(response.data, "response");
          this.officeStatusDetails = response.data

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      // error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }

  openAttachment(fileName: string): void {
    this.masterService.downloadDoc(fileName).subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: res.type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert("File not found or download failed");
      },
    });
  }


}
