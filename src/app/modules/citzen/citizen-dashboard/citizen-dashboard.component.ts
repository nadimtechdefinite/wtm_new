import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Accessibility from 'highcharts/modules/accessibility';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { MobileService } from '../../../services/mobile.service';
import { filter, Subject } from 'rxjs';
import { CitizenStoreService } from '../../../services/citizen-store.service';
import { MenuReloadService } from '../../../services/citizen-dashboard.component';
import { NavigationEnd, Router } from '@angular/router';
import { masterService } from '../../../services/master.service';


Accessibility(Highcharts);
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.scss']
})
export class CitizenDashboardComponent implements OnInit, AfterViewInit {
  private destroy$ = new Subject<void>();
  pageTitle: string = '';
  citizenData: any;
  chartSummary: any[] = [];
  citizenId: any;
  getcitizenId: any;
  mobileNo: any;
  userName: any;
  parsedUserInfo: any;
  schemeCode: any;
  userInfo: string | null = null;
  grievanceId: any;
  getCitizenId: any;
  officeStatusDetails: any;
  userCode:any;
  userType:any;
  loginName:any;
  Highcharts: typeof Highcharts = Highcharts;
  UserMobile: any;
  UserCitizenId: any;
  constructor(private commonService: CommonService, private route: ActivatedRoute, private mobileService: MobileService,
    private citizenStore: CitizenStoreService,
    private router: Router,
     private masterService: masterService,
    private menuReload: MenuReloadService,
  ) {

  }
  apiResponse = {
    totalRegister: 100,
    completed: 15,
    underProcess: 20,
    return: 10,


    underProcessDetails: [
      { y: 150, color: '#007bff' },
      { y: 100, color: '#28a745' },
      { y: 800, color: '#dc3545' },
      { y: 90, color: '#ffc107' },
      { y: 450, color: '#17a2b8' },
      { y: 600, color: '#6610f2' },
      { y: 300, color: '#fd7e14' },
      { y: 480, color: '#6f42c1' },
      { y: 200, color: '#20c997' },
      { y: 150, color: '#e83e8c' }
    ],
    returnDetails: [900, 950, 970, 500, 900, 850, 600, 500, 700, 950],
    categories: ['5/1', '6/1', '7/1', '8/1', '9/1', '10/1', '11/1', '12/1', '13/1', '14/1']
  };

  goToGrievanceList(status: string) {
  this.router.navigate(
    ['/layout/citizen/graviance-list'],
    { queryParams: { status } }
  );
}

  ngOnInit(): void {
     this.mobileService.updatelogindata$.subscribe(value => {
    this.citizenId = value.data.citizenId;
    this.mobileNo = value.data.mobileNo;
  });
     this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.UserMobile = this.parsedUserInfo.mobileNo;
      this.UserCitizenId = this.parsedUserInfo.citizenId;
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.schemeCode = this.parsedUserInfo.schemeCode
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
    }
    if(this.UserCitizenId && this.UserMobile) {
       this.getCitizenDetails();
    }
       

  }

  ngAfterViewInit(): void {
    // this.createChartGauge();
    // this.createChartLine();
  }
  getCardBg(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #6a11cb, #2575fc)',
      'linear-gradient(135deg, #28a745, #218838)',
      'linear-gradient(135deg, #ffc107, #e0a800)',
      'linear-gradient(135deg, #dc3545, #c82333)'
    ];
    return gradients[index % gradients.length];
  }

citzenDetails:any
grievanceList:any
  getCitizenDetails() {
    if (this.UserCitizenId && this.UserMobile) {
      this.masterService
        .citizenDetails(this.UserCitizenId, this.UserMobile)
        .subscribe((res: any) => {
          if (res) {
            this.citzenDetails = res.data
            this.prepareChartData();
            console.log('User List Citizen Details:', this.citzenDetails);
          }
        });
    }
  }

  prepareChartData() {
    if (!this.citzenDetails) return;

    this.chartSummary = [
      { name: 'Completed', y: this.citzenDetails.completed, color: '#28a745' },
      { name: 'Under Process', y: this.citzenDetails.underProcess, color: '#e0a800' },
      { name: 'Returned', y: this.citzenDetails.returned, color: '#dc3545' }
    ];

    this.loadPieChart();
    this.loadColumnChart();
  }

  loadPieChart() {
    Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Grievance Status'
      },
        credits: {
      enabled: false 
    },
      series: [{
        name: 'Count',
        data: this.chartSummary
      }]
    } as any);
  }


  loadColumnChart() {
    Highcharts.chart('chart-column', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Total Grievance Overview'
      },
       credits: {
      enabled: false 
    },
      xAxis: {
        categories: ['Total Registered', 'Completed', 'Under Process', ]
      },
      series: [{
        name: 'Count',
     data: [
        { y: this.citzenDetails.totalRegistered, color: '#007bff' }, // Blue
        { y: this.citzenDetails.completed, color: '#28a745' },       // Green
        { y: this.citzenDetails.underProcess, color: '#e0a800' },    // Yellow
        // { y: this.citzenDetails.returned, color: '#dc3545' }         // Red
      ]
      }]
    } as any);
  }


}
