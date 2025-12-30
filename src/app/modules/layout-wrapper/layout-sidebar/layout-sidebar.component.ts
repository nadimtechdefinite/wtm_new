import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;   // 🔹 String rakha (array ki jagah simple string use karein)
  color?: string;
  children?: MenuItem[];
  roles?: string[];
  expanded?: boolean;
}
@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout-sidebar.component.html',
  styleUrl: './layout-sidebar.component.scss'
})
export class LayoutSidebarComponent implements OnInit {
    selectedRoute: string = '';
  parsedUserInfo: any;
  userCode: any;
  userType: any;

  constructor(private router: Router) { }
 citizenLinks: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/layout/citizen/dashboard', icon: 'fas fa-home', color: '#ff5722' },          // Orange
    { label: 'Complain List', routerLink: '/layout/citizen/graviance-list', icon: 'fas fa-users', color: '#3f51b5' },
    
    // {
    //   label: 'Event',
    //   icon: 'fas fa-calendar-alt', // calendar icon
    //   color: '#2196f3', // Blue
    //   children: [
    //     { label: 'Educational', routerLink: '/dashboard/events/educational-events-list', icon: 'fas fa-book-open', color: '#4caf50' },  // book for education
    //     { label: 'Social', routerLink: '/dashboard/events/social-events-list', icon: 'fas fa-users', color: '#f44336' } // users for social
    //   ]
    // },
  ];


  // ✅ Empty arrays future ke liye
  adminLinks: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/layout/admin/dashboard', icon: 'fa fa-home', color: '#ff5722' },
    { label: 'Review/Update Status', routerLink: '/layout/admin/admin-grievance-list', icon: 'fa fa-hand-holding-heart', color: '#e91e63' },
  ];

  menu: MenuItem[] = [];
  userRole: string = 'citizen' 
  ngOnInit(): void {
       const userInfo = sessionStorage.getItem('userInfo');
      if (userInfo) {
        this.parsedUserInfo = JSON.parse(userInfo);
        this.userType = Number(this.parsedUserInfo.userType);
        console.log(this.userType, "this.userType");
        
      }

    console.log('User Role:', this.parsedUserInfo);  // ✅ role check karne ke liye
    // switch (this.userRole) {
    //   case 'citizen':
    //     this.menu = this.citizenLinks;
    //     break;
    //   case 'this.userType === 1 || this.userType === 2':
    //     this.menu = this.adminLinks;
    //     break;
    //   default:
    //     this.menu = [];
    //     break;
    // }
    if (this.userType === 1 || this.userType === 2) {
        this.menu = this.adminLinks;
      } else if (this.userRole === 'citizen') {
        this.menu = this.citizenLinks;
      } else {
        this.menu = [];
      }
   if(this.userType === 1 || this.userType === 2){
   this.selectedRoute = this.router.url || '/layout/admin/dashboard';
   }else{
       this.selectedRoute = this.router.url || '/layout/citizen/dashboard';
   }
  //  this.selectedRoute = this.router.url || '/layout/citizen/dashboard';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedRoute = event.urlAfterRedirects;
        this.expandParentMenu(this.selectedRoute);
      }
    });
  }
expandParentMenu(route: string) {
    this.menu.forEach(item => {
      if (item.children) {
        item.expanded = item.children.some(child => child.routerLink === route);
      }
    });
  }
  // 🔹 Safe ID generator
  getId(label: string, index?: number): string {
    return (label ?? '').replace(/\s+/g, '') + (index ?? '');
  }

}
