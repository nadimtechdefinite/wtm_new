import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { NOTO_SANS } from '../../../../assets/fonts/noto-sans.base64';
import { NOTO_SANS_TAMIL } from '../../../../assets/fonts/NotoSansTamil-Regular.base64';
import { GUJARATI } from '../../../../assets/fonts/noto-sans.gujarati.base64';

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
    { column: 'translatedDesc', header: 'Translated Transcript', width: '20%' },
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
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.column);
    this.mobileService.updatelogindata$.subscribe(value => {
      this.citizenId = value?.data?.citizenId;
      this.mobileNo = value?.data?.mobileNo;
    });

    this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.schemeCode = this.parsedUserInfo.schemeCode
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
    }
    this.route.queryParams.subscribe((params) => {
      const status = params['status'];
      this.selectedStatus = status || null;
      if (
        status === 'PENDING_1_WEEK' ||
        status === 'PENDING_7_15_DAYS' ||
        status === 'PENDING_15_30_DAYS' ||
        status === 'PENDING_30_90_DAYS' ||
        status === 'PENDING_MORE_THAN_90'
      ) {
        this.pendingCount();
      } else {
        this.getGrievanceDetailsForAdmin();
      }
    });
    this.officeStatus();
  }

  pendingCount() {
    this.masterService
      .pendingCountForAdmin(this.schemeCode, this.selectedStatus)
      .subscribe((res: any) => {
        if (res.messageCode === 1) {
          this.GrievanceContent = res.data.map((item: any, i: any) => ({
            ...item,
            SerialNo: i + 1
          }));
          this.admindataSource = new MatTableDataSource(this.GrievanceContent);
          this.admindataSource.paginator = this.paginator;
        }
        else {
        }
      });
  }

  // getGrievanceDetailsForAdmin() {
  //   this.masterService
  //     .getGrievanceDetailsForAdmin(this.schemeCode)
  //     .subscribe((res: any) => {
  //       if (res.messageCode === 1) {
  //         this.GrievanceContent = res.data.map((item: any, i: any) => ({
  //           ...item,
  //           SerialNo: i + 1
  //         }));
  //         this.applyFilterq();
  //         console.log('User List Citizen Details:', this.citzenDetails);
  //         const tableData = this.selectedStatus ? this.filteredList : this.GrievanceContent;
  //         this.admindataSource = new MatTableDataSource(tableData);
  //         this.admindataSource.paginator = this.paginator;
  //       }
  //       else {

  //       }
  //     });

  // }

  getGrievanceDetailsForAdmin() {
  this.masterService
    .getGrievanceDetailsForAdmin(this.schemeCode)
    .subscribe({
      next: (res: any) => {
        if (res?.messageCode === 1 && Array.isArray(res.data)) {

          this.GrievanceContent = res.data.map((item: any, i: number) => ({
            ...item,
            SerialNo: i + 1
          }));

          this.applyFilterq();

          const tableData = this.selectedStatus
            ? this.filteredList
            : this.GrievanceContent;

          this.admindataSource = new MatTableDataSource(tableData);
          this.admindataSource.paginator = this.paginator;

        } else {
          console.error('Failed to load scheme list:', res?.errorMsg || 'Unknown error');
        }
      },

      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(err, 'loading scheme list')
      },
      complete: () => {
        console.log('getGrievanceDetailsForAdmin() completed');
      }
    });
}

  filteredList: any[] = [];
  selectedStatus: string | null = null;

  applyFilterq
    () {
    let data: any[] = [];

    if (!this.selectedStatus || this.selectedStatus === 'T') {
      data = [...this.GrievanceContent];
    } else {
      data = this.GrievanceContent.filter(
        (g: any) => g.status === this.selectedStatus
      );
    }

    // 🔹 Re-assign SerialNo after filter
    this.filteredList = data.map((item, index) => ({
      ...item,
      SerialNo: index + 1
    }));

    // 🔹 Update table datasource also
    this.admindataSource = new MatTableDataSource(this.filteredList);
    this.admindataSource.paginator = this.paginator;
  }


  exportToExcel() {
    const tableData = this.GrievanceContent;
    if (!tableData || tableData.length === 0) {
      alert('No data available to export');
      return;
    }

    // 🔹 Excel ke liye clean data banao
    const exportData = tableData.map((item: any) => ({
      'S.No': item.SerialNo,
      'Grievance No': item.grievanceNumber,
      'Address': [
        item.stateName,
        item.districtName,
        item.blockName,
        item.panchayatName,
        item.villageName,
        item.pinCode
      ].filter(Boolean).join(', '),
      'Scheme/Division': item.schemeName,
      'Description': item.description,
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
    doc.addFileToVFS('NotoSans-Regular.ttf', NOTO_SANS);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.setFont('NotoSans');

    // Tamil
    doc.addFileToVFS('NotoSansTamil-Regular.ttf', NOTO_SANS_TAMIL);
    doc.addFont('NotoSansTamil-Regular.ttf', 'NotoSansTamil', 'normal');

    // Tamil
    doc.addFileToVFS('NotoSansGujarati-Regular.ttf', GUJARATI);
    doc.addFont('NotoSansGujarati-Regular.ttf', 'NotoSansGujarati', 'normal');

    const topMargin = 20;
    // 🔹 Title
    doc.setFontSize(14);
    doc.text('Write To Rural Development Minister', 110, 13);
    doc.setFontSize(12);
    doc.text('Admin/PD Grievance List', 14, topMargin);


    // 🔹 Table Header
    const headers = [[
      'S.No',
      'Grievance Id',
      'Scheme/Division',
      'Address',
      'Description (Source language)',
      'Translated Transcript',
      'Date',
      'Status',
    ]];

    // 🔹 Table Body
    const data = tableData.map((item: any) => ([
      item.SerialNo,
      item.grievanceNumber,
      item.schemeName || '',
      [
        item.stateName,
        item.districtName,
        item.blockName,
        item.panchayatName,
        item.villageName,
        item.pinCode
      ].filter(Boolean).join(', '),
      item.description || '',
      item.translatedDesc || '',
      item.createdOn ? new Date(item.createdOn).toLocaleDateString('en-GB') : '',
      item.status === 'U' ? 'Under Process' :
        item.status === 'C' ? 'Completed' : item.status,
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
      didParseCell: (hookData) => {
        const cellText = String(hookData.cell.text || '');
        const font = this.detectFont(cellText);
        hookData.cell.styles.font = font;
      },
      headStyles: {
        fillColor: [22, 92, 173] // blue header
      }
    });

    // 🔹 Download
    doc.save(`Admin/PD_Grievance_List_${Date.now()}.pdf`);
  }

  detectFont(text: string): string {
    if (/[\u0B80-\u0BFF]/.test(text)) return 'NotoSansTamil';     // Tamil
    if (/[\u0900-\u097F]/.test(text)) return 'NotoSans';      // Hindi
    if (/[\u0A80-\u0AFF]/.test(text)) return 'NotoSansGujarati';  // Gujarati
    if (/[\u0980-\u09FF]/.test(text)) return 'NotoSansBengali';   // Bengali
    return 'NotoSans';                                           // English
  }



}
