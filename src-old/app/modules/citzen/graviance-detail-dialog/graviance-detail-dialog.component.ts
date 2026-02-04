import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { masterService } from '../../../services/master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
@Component({
  selector: 'app-graviance-detail-dialog',
  standalone: true,

  imports: [CommonModule, MatDialogModule, ...MATERIAL_MODULES, ReactiveFormsModule, FormsModule, A11yModule],
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
    private alertService: AlertService,
    private masterService: masterService,
    private dialogRef: MatDialogRef<GravianceDetailDialogComponent>,
    private toastr: ToastrService,) {
    this.citizendetails = data.citizen
    this.citizenId = data.citizen.citizenId
    this.grievancedetails = data.grievance
    this.grievanceStatus = data.grievance.status,
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
            this.alertService
          .success(res?.message)
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close('reload');
          });
          // this.dialogRef.close('reload');
          // this.toastr.success(res.message);
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

printDialog() {
  const printContents = document.getElementById('print-section')?.innerHTML;
  if (!printContents) return;

  const printWindow = window.open('', '', 'height=800,width=1200');

  printWindow!.document.write(`
    <html>
      <head>
        <title>Write To Rural Development Minister</title>

        <!-- Bootstrap (optional but recommended) -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .card, table {
            page-break-inside: avoid;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid #000;
          }

          th, td {
            padding: 6px;
            font-size: 12px;
          }

          .chat-card {
            border: 1px solid #ccc;
            padding: 10px;
          }

          .chat-message {
            margin-bottom: 10px;
          }

          .message-bubble {
            border: 1px solid #ddd;
            padding: 8px;
            border-radius: 6px;
          }

          /* ❌ Hide buttons */
          button, .pdfIcon {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

  printWindow!.document.close();
  printWindow!.focus();

  setTimeout(() => {
    printWindow!.print();
    printWindow!.close();
  }, 500);
}
}
