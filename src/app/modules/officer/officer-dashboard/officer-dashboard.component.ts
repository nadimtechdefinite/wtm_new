import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { masterService } from '../../../services/master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../../shared/error-handler.service';


@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './officer-dashboard.component.html',
  styleUrl: './officer-dashboard.component.scss'
})
export class OfficerDashboardComponent {
 pageTitle: string = '';
  Highcharts: typeof Highcharts = Highcharts;
  adminPdsummary: any;
  userInfo: any;
  parsedUserInfo: any;
  userCode: any;
  loginName: any;
  userType: any;
  schemeCode: any;
  constructor(private commonService: CommonService, private masterService: masterService, private errorHandler: ErrorHandlerService,) { }
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
    this.userInfo = sessionStorage.getItem('userInfo');
    if (this.userInfo) {
      this.parsedUserInfo = JSON.parse(this.userInfo);
      this.userCode = this.parsedUserInfo.userCode;
      this.userType = this.parsedUserInfo.userType;
      this.schemeCode = this.parsedUserInfo.schemeCode;
      this.loginName = this.parsedUserInfo.loginName
      console.log(this.userType, "this.userType");
      this.adminSummary();
    }
  }
  ngAfterViewInit(): void {
    // this.createChartGauge();
    this.createChartPie();
    this.createChartColumn();
    // this.createChartLine();
  }



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

  getCardBg(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #6a11cb, #2575fc)',
      'linear-gradient(135deg, #28a745, #218838)',
      'linear-gradient(135deg, #ffc107, #e0a800)',
      'linear-gradient(135deg, #dc3545, #c82333)'
    ];
    return gradients[index % gradients.length];
  }


  adminSummary() {
    const role = this.schemeCode 
    this.masterService.adminSummaryDetails(role).subscribe({
      next: (response: any) => {
        if (response?.messageCode === 1) {
          console.log(response.data, "response");
          this.adminPdsummary = response.data

        } else {
          console.error('Failed to load scheme list:', response?.errorMsg || 'Unknown error');
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleHttpError(err, 'loading scheme list')
    });
  }


  

}
