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
    completedDetails: [
      { name: '5/1', y: 10 },
      { name: '6/1', y: 20 },
      { name: '7/1', y: 30 },
      { name: '8/1', y: 15 },
      { name: '9/1', y: 25 }
    ],
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

  summaryCards = [
    {
      title: 'Total Register',
      value: 52,
      icon: '⏱️',
      bg: 'linear-gradient(135deg, #6a11cb, #2575fc)',
      chart: { type: 'gauge', data: [52] }
    },
    {
      title: 'Completed',
      value: 15,
      icon: '🥧',
      bg: 'linear-gradient(135deg, #28a745, #218838)',
      chart: {
        type: 'pie', data: [
          { name: '5/1', y: 10, color: '#ff6384' },
          { name: '6/1', y: 20, color: '#36a2eb' },
          { name: '7/1', y: 30, color: '#ffce56' },
          { name: '8/1', y: 15, color: '#4bc0c0' },
          { name: '9/1', y: 25, color: '#9966ff' }
        ]
      }
    },
    {
      title: 'Under Process',
      value: 20,
      icon: '📊',
      bg: 'linear-gradient(135deg, #ffc107, #e0a800)',
      chart: {
        type: 'column', categories: ['5/1', '6/1', '7/1', '8/1', '9/1', '10/1', '11/1', '12/1', '13/1', '14/1'], data: [
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
        ]
      }
    },
    {
      title: 'Return',
      value: 10,
      icon: '📈',
      bg: 'linear-gradient(135deg, #dc3545, #c82333)',
      chart: { type: 'line', categories: ['5/1', '6/1', '7/1', '8/1', '9/1', '10/1', '11/1', '12/1', '13/1', '14/1'], data: [900, 950, 970, 500, 900, 850, 600, 500, 700, 950] }
    }
  ];


  ngOnInit(): void { 
this.loadCitizenDetails();
  }
  ngAfterViewInit(): void {
    // this.createChartGauge();
    this.createChartPie();
    this.createChartColumn();
    // this.createChartLine();
  }

  // private createChartGauge(): void {
  //   const chart = Highcharts.chart('chart-gauge', {
  //     chart: { type: 'solidgauge' },
  //     title: { text: 'Gauge Chart' },
  //     credits: { enabled: false },
  //     pane: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       center: ['50%', '85%'],
  //       size: '160%',
  //       background: { innerRadius: '60%', outerRadius: '100%', shape: 'arc' },
  //     },
  //     yAxis: {
  //       min: 0,
  //       max: this.apiResponse.totalRegister, // dynamic max
  //       stops: [
  //         [0.1, '#55BF3B'],
  //         [0.5, '#DDDF0D'],
  //         [0.9, '#DF5353'],
  //       ],
  //       minorTickInterval: null,
  //       tickAmount: 2,
  //       labels: { y: 16 },
  //     },
  //     plotOptions: {
  //       solidgauge: { dataLabels: { y: -25, borderWidth: 0, useHTML: true } },
  //     },
  //     tooltip: { enabled: false },
  //     series: [{
  //       name: null,
  //       data: [this.apiResponse.totalRegister], // dynamic value
  //       dataLabels: {
  //         format: `<div style="text-align: center"><span style="font-size: 1.25rem">{y}</span></div>`,
  //       },
  //     }],
  //   } as any);
  // }

  private createChartPie(): void {
    const chart = Highcharts.chart('chart-pie', {
      chart: { type: 'pie' },
      title: { text: 'Grievance Overview' },
      credits: { enabled: false },
      tooltip: {
        headerFormat: `<span class="mb-2">Date: {point.key}</span><br>`,
        pointFormat: '<span>Amount: {point.y}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '50%',
        data: this.apiResponse.completedDetails, // dynamic
      }],
    } as any);
  }

  private createChartColumn(): void {
    const chart = Highcharts.chart('chart-column', {
      chart: { type: 'column' },
      title: { text: 'Grievance Register' },
      credits: { enabled: false },
      legend: { enabled: false },
      yAxis: { min: 0, title: undefined },
      xAxis: { type: 'category', categories: this.apiResponse.categories },
      tooltip: {
        headerFormat: `<div>Date: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        shared: true,
        useHTML: true,
      },
      plotOptions: { bar: { dataLabels: { enabled: true } } },
      series: [{
        name: 'Amount',
        data: this.apiResponse.underProcessDetails, // dynamic
      }],
    } as any);
  }

  // private createChartLine(): void {
  //   const chart = Highcharts.chart('chart-line', {
  //     chart: { type: 'line' },
  //     title: { text: 'Line Chart' },
  //     credits: { enabled: false },
  //     legend: { enabled: false },
  //     yAxis: { title: { text: null } },
  //     xAxis: { type: 'category', categories: this.apiResponse.categories },
  //     tooltip: {
  //       headerFormat: `<div>Date: {point.key}</div>`,
  //       pointFormat: `<div>{series.name}: {point.y}</div>`,
  //       shared: true,
  //       useHTML: true,
  //     },
  //     series: [{
  //       name: 'Amount',
  //       data: this.apiResponse.returnDetails, // dynamic
  //     }],
  //   } as any);
  // }

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
        });
    });
  }


}
