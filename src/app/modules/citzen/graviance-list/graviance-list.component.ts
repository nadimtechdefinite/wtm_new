import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material/material';
import { GravianceDetailDialogComponent } from '../graviance-detail-dialog/graviance-detail-dialog.component';
import { MobileService } from '../../../services/mobile.service';
import { masterService } from '../../../services/master.service';
import { ProgramDivisonDialogComponent } from '../../program-divison/program-divison-dialog/program-divison-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';


@Component({
  selector: 'app-graviance-list',
  standalone: true,
  imports: [...MATERIAL_MODULES, CommonModule, RouterModule   ],
  templateUrl: './graviance-list.component.html',
  styleUrl: './graviance-list.component.scss'
})
export class GravianceListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // component.ts

  displayedColumns: string[] = [
    'serialNo',
    'grievanceNumber',
    'schemeName',
    'description',
    'translatedDesc',
    'createdOn',
    'status',
    'action'
  ];

  columns = [
    { column: 'serialNo', header: 'Sr.No' },
    { column: 'grievanceNumber', header: 'Grievance ID' },
    { column: 'schemeName', header: 'Scheme/Division' },
    { column: 'description', header: 'Description', width: '30%' },
    { column: 'translatedDesc', header: 'translate Desc', width: '20%' },
     { column: 'createdOn', header: 'Date', type: 'date',width: '10%' },
     { column: 'status', type: 'status', header: 'Status',width: '10%' },
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
    this.mobileService.updatelogindata$.subscribe(value => {
    this.citizenId = value.data.citizenId;
    this.mobileNo = value.data.mobileNo;
    this.getCitizenDetails();
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
    }
this.officeStatus();
  }



getCitizenDetails() {
  if (this.citizenId && this.mobileNo) {
    this.masterService
      .citizenDetails(this.citizenId, this.mobileNo)
      .subscribe((res: any) => {
        if (res) {
          this.citzenDetails = res.data
          this.grievanceList = res.data.grievanceDetails.map((item:any,index:any) => {
            return {
              ...item,
              serialNo:index+1
            };
          });;
          // this.grievanceList = res.data.grievanceDetails
          console.log('User List Citizen Details:', this.citzenDetails);
          this.dataSource = new MatTableDataSource(this.grievanceList);
          this.dataSource.paginator = this.paginator;
        }
      });
  }
}



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  registerComplaint() {
    this.router.navigate(['/layout/citizen/add-grievance']);
  }

openViewDialog(row: any, citizenDetails: any) {
  const dialogRef = this.dialog.open(GravianceDetailDialogComponent, {
    width: '65%',
    maxWidth: '90vw',
    data: {
      grievance: row,
      citizen: citizenDetails
    }
  });
      dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'reload') {
        this.getCitizenDetails(); // 🔁 API reload
      }
    });
}



  officeStatus() {
    this.masterService.getcitizenStatus().subscribe({
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



applyStatusFilter(status: string) {

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!filter) return true;
    return data.status === filter;
  };
  this.dataSource.filter = status ? status.trim() : '';
}
}
