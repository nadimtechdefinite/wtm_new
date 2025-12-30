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
    'grievanceNumber',
    // 'stateName',
    // 'districtName',
    // 'blockName',
    // 'panchayatName',
    // 'villageName',
    'schemeName',
    'description',
    'createdOn',
    'status',
    'action'
  ];

  columns = [
    { column: 'grievanceNumber', header: 'Grievance ID' },
    // { column: 'stateName', header: 'State' },
    // { column: 'districtName', header: 'District' },
    // { column: 'blockName', header: 'Block' },
    // { column: 'panchayatName', header: 'Panchayat' },
    // { column: 'villageName', header: 'Village' },
    { column: 'schemeName', header: 'Scheme/Division' },
    { column: 'description', header: 'Description' },
     { column: 'createdOn', header: 'Date' },
     { column: 'status', header: 'Status' },
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

  constructor(private dialog: MatDialog, 
      private router: Router,    
      private mobileService: MobileService,
      private masterService: masterService) { }

  ngOnInit() {
    // this.dataSource.data = this.dummyList;
    this.mobileService.updatelogindata$.subscribe(value => {
    this.citizenId = value.data.citizenId;
    this.mobileNo = value.data.mobileNo;
    // ✅ API CALL HERE
    this.getCitizenDetails();
  });


    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      this.parsedUserInfo = JSON.parse(userInfo);
    }

  }



getCitizenDetails() {
  if (this.citizenId && this.mobileNo) {
    this.masterService
      .citizenDetails(this.citizenId, this.mobileNo)
      .subscribe((res: any) => {
        if (res) {
          this.citzenDetails = res.data;
          this.grievanceList = res.data.grievanceDetails;
          // this.grievanceList = res.data.grievanceDetails.map((item:any) => {
          //   return {
          //     ...item,
          //     filePath: item.filePath.replace(/\\/g, '/') // replaces all \ with /
          //   };
          // });
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
  this.dialog.open(ProgramDivisonDialogComponent, {
    width: '65%',
    maxWidth: '90vw',
    data: {
      grievance: row,
      citizen: citizenDetails
    }
  });
}

}
