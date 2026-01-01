import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-graviance-detail-dialog',
  standalone: true,
  
    imports: [CommonModule, MatDialogModule,...MATERIAL_MODULES, ReactiveFormsModule, FormsModule, A11yModule],
  templateUrl: './graviance-detail-dialog.component.html',
  styleUrl: './graviance-detail-dialog.component.scss'
})
export class GravianceDetailDialogComponent {
  displayedColumns: string[] = ['grievanceId', 'schemeName', 'ministryName', 'stateName', 'districtName', 'blockNameName', 'pinCode', 'villageName', 'panchayatName', 'description', 'attachment']; // columns you want
  dataSource!: MatTableDataSource<any>;
  grievancedetails: any;
  citizendetails: any;
    feedbackComments: string = '';
  citizenSatisfaction: string = '';
  citizenFeedback: string = '';
  citizenComment: string = '';
  grievanceStatus: any;
    satisfiedStatus: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log(data, "data");
    debugger
   this.citizendetails = data.citizen
   this.grievancedetails = data.grievance
   this.grievanceStatus = data.grievance.status
    this.dataSource = new MatTableDataSource([this.grievancedetails]); 
}

// ngOnInit() {
//     // Initialize the table data
//     this.dataSource = new MatTableDataSource(this.data); 
//     // Assuming your data is like { items: [ {id:1, name:'a', description:'b'} ] }
//   }

selectedSatisfied(event:any){ 
 const seti = event.value
}

  downloadFile(filePath: string, fileName: string) {
    debugger
    const link = document.createElement('a');
    link.href = filePath; // full URL if backend hosted separately
    link.download = fileName;
    link.click();
  }

  submitFeedback(){}

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


}
