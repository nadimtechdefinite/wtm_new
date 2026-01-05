import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { MobileService } from '../../../services/mobile.service';
import { masterService } from '../../../services/master.service';
import { ProgramDivisonDialogComponent } from '../../program-divison/program-divison-dialog/program-divison-dialog.component';
import { GravianceDetailDialogComponent } from '../../citzen/graviance-detail-dialog/graviance-detail-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-grievance-list-admin',
  standalone: true,
  imports: [...MATERIAL_MODULES, CommonModule, RouterModule],
  templateUrl: './grievance-list-admin.component.html',
  styleUrl: './grievance-list-admin.component.scss'
})
export class GrievanceListAdminComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // component.ts

  //  displayedColumns: string[] = [
  //    'grievanceNumber',

  //    'schemeName',
  //    'description',
  //    'createdOn',
  //    'status',
  //    'action'
  //  ];

  displayedColumns: string[] = [];


  columns = [
    { column: 'SerialNo', header: 'Serial No.' },
    { column: 'grievanceNumber', header: 'Grievance ID' },
    { column: 'schemeName', header: 'Scheme/Division' },
    { column: 'address', header: 'Address', type: 'address', width: '15%' },
    { column: 'description', header: 'Description (Source language)', width: '30%' },
    { column: 'translatedDesc', header: 'Transcripte (In English)', width: '20%' },
    { column: 'createdOn', header: 'Date', type: 'date', width: '10%' },
    { column: 'status', type: 'status', header: 'Status', width: '10%' },
    { column: 'action', header: 'Action', type: 'action' }
  ];

  citizenId: any;
  mobileNo: any;
  citzenDetails: any;
  dataSource = new MatTableDataSource<any>([]);
  admindataSource = new MatTableDataSource<any>([]);
  grievanceList: any;
  GrievanceDetailsForAdmin: any;
  GrievanceContent: any;
  parsedUserInfo: any;
  schemeCode: any;
  userInfo: string | null = null;
  grievanceId: any;
  getCitizenId: any;
  officeStatusDetails: any;
  userCode: any;
  userType: any;
  loginName: any;

  constructor(private dialog: MatDialog,
    private router: Router,
    private mobileService: MobileService,
    private masterService: masterService,
    private errorHandler: ErrorHandlerService,) { }

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.column);
    // this.dataSource.data = this.dummyList;
    this.mobileService.updatelogindata$.subscribe(value => {
      this.citizenId = value.data.citizenId;
      this.mobileNo = value.data.mobileNo;
      // ✅ API CALL HERE

    });



    this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      debugger
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.schemeCode = this.parsedUserInfo.schemeCode
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
      this.getGrievanceDetailsForAdmin()
    }
    this.officeStatus();
  }
  getGrievanceDetailsForAdmin() {
    this.masterService
      .getGrievanceDetailsForAdmin(this.schemeCode)
      .subscribe((res: any) => {
        if (res.messageCode === 1) {
          this.GrievanceContent = res.data.map((item: any, i: any) => ({
            ...item,
            SerialNo: i + 1
          }));
          // this.grievanceList = res.data.grievanceDetails;
          console.log('User List Citizen Details:', this.citzenDetails);
          this.admindataSource = new MatTableDataSource(this.GrievanceContent);
          this.admindataSource.paginator = this.paginator;
        }
        else {

        }
      });

  }

exportToExcel() {
  // 🔹 Same data jo table me dikh raha hai
  // const tableData = this.selectedStatus ? this.filteredList : this.grievanceList;
  const tableData = this.GrievanceContent;
  if (!tableData || tableData.length === 0) {
    alert('No data available to export');
    return;
  }

  // 🔹 Excel ke liye clean data banao
  const exportData = tableData.map((item: any) => ({
    'S.No': item.serialNo,
    'Grievance No': item.grievanceNumber,
    'Address': item.ministryName,
    'Scheme/Division': item.schemeName,
    'Description': item.stateName,
    "transitioned Desc": item.translatedDesc,
    'Created Date': item.createdOn ? new Date(item.createdOn).toLocaleDateString() : '',
    'Status': item.status === 'U' ? 'Under Process' :
              item.status === 'C' ? 'Completed' : item.status,
  }));

  // 🔹 Worksheet & Workbook
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Grievance List': worksheet },
    SheetNames: ['Grievance List']
  };

  // 🔹 Excel file generate
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.saveExcelFile(excelBuffer, 'Citizen_Grievance_List');
}


saveExcelFile(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], {
    type: 'application/octet-stream'
  });
  saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}

  ngAfterViewInit() {
    this.admindataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.admindataSource.filter = filterValue.trim().toLowerCase();
  }

  registerComplaint() {
    this.router.navigate(['/layout/citizen/add-grievance']);
  }

  openViewDialog(row: any, citizenDetails: any) {

    this.dialog.open(GravianceDetailDialogComponent, {
      width: '65%',
      maxWidth: '90vw',
      data: {
        grievance: row,
        citizen: citizenDetails
      }
    });
  }



  openViewDialogAdmin(row: any, citizenDetails: any) {
    const dialogRef = this.dialog.open(ProgramDivisonDialogComponent, {
      width: '65vw',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog', // 🔥 MUST
      disableClose: true,
      data: {
        grievance: row,
        citizen: citizenDetails
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'reload') {
        this.getGrievanceDetailsForAdmin(); // 🔁 API reload
      }
    });
  }

  applyStatusFilter(status: string) {
    this.admindataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
      return data.status === filter;
    };

    this.admindataSource.filter = status;
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


exportToPdf() {
  // const tableData = this.selectedStatus ? this.filteredList : this.grievanceList;
  const tableData = this.GrievanceContent;

  if (!tableData || tableData.length === 0) {
    alert('No data available');
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4'); // landscape

  // 🔹 Title
  doc.setFontSize(14);
  doc.text('Admin/PD Grievance List', 14, 15);

  // 🔹 Table Header
  const headers = [[
    'S.No',
    'Grievance No',
    'Status',
    'Ministry',
    'Scheme',
    'Description (Source language)',
    'Transcripte (In English)',
    'Date'
  ]];

  // 🔹 Table Body
  const data = tableData.map((item: any) => ([
    item.serialNo,
    item.grievanceNumber,
    item.status === 'U' ? 'Under Process' :
    item.status === 'C' ? 'Completed' : item.status,
    item.ministryName || '',
    item.schemeName || '',
    item.description || '',
    item.translatedDesc || '',
    item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB') : ''
  ]));

  // 🔹 Auto Table
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 22,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [22, 92, 173] // blue header
    }
  });

  // 🔹 Download
  doc.save(`Admin/PD_Grievance_List_${Date.now()}.pdf`);
}


}
