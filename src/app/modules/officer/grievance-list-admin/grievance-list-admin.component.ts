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
    { column: 'description', header: 'Description', width: '40%' },
    { column: 'createdOn', header: 'Date' },
    { column: 'status', type: 'status', header: 'Status' },
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
  userCode:any;
  userType:any;
  loginName:any;

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
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.schemeCode = this.parsedUserInfo.schemeCode
      console.log(this.schemeCode, "this.schemeCode");
    
    }
    this.getGrievanceDetailsForAdmin()
  

        this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
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
    disableClose:true,
    data: {
      grievance: row,
      citizen: citizenDetails
    }
  });
    dialogRef.afterClosed().subscribe((result:any) => {
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
    debugger
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
}
