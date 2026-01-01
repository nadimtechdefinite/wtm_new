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
import { filter } from 'rxjs';
import { CitizenStoreService } from '../../../services/citizen-store.service';


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
  pageTitle: string = '';
     citizenData: any;
     chartSummary: any[] = [];
     citizenId: any;
  getcitizenId: any;
    mobileNo: any;
     userName:any;
  Highcharts: typeof Highcharts = Highcharts;
  constructor(private commonService: CommonService, private route: ActivatedRoute,private mobileService: MobileService, private citizenStore: CitizenStoreService) { }
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




  ngOnInit(): void { 
this.loadCitizenDetails();
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


  loadCitizenDetails() {
    this.mobileService.updatelogindata$.subscribe(value => {
      if (!value || !value.data) return;
  
      this.getcitizenId = value.data.citizenId;
      this.mobileNo = value.data.mobileNo;
  
      // 🔥 Call API only after values are ready
      this.citizenStore.loadCitizenDetails(this.getcitizenId, this.mobileNo);
  
      // Subscribe to citizen data
      this.citizenStore.citizenDetails$
        .pipe(filter((data: any) => data !== null))
        .subscribe(data => {
          console.log('Citizen Data:', data);
          this.citizenData = data;
          this.userName = data?.name; // agar aapko name chahiye
          this.prepareChartData();
        });
    });
  }



  prepareChartData() {
  if (!this.citizenData) return;

  this.chartSummary = [
    { name: 'Completed', y: this.citizenData.completed },
    { name: 'Under Process', y: this.citizenData.underProcess },
    { name: 'Returned', y: this.citizenData.returned }
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
    xAxis: {
      categories: ['Total Registered', 'Completed', 'Under Process', 'Returned']
    },
    series: [{
      name: 'Count',
      data: [
        this.citizenData.totalRegistered,
        this.citizenData.completed,
        this.citizenData.underProcess,
        this.citizenData.returned
      ]
    }]
  } as any);
}

}
