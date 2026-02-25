import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CitizenStoreService } from '../../../services/citizen-store.service';
import { MobileService } from '../../../services/mobile.service';
import { filter } from 'rxjs';
import { MenuReloadService } from '../../../services/citizen-dashboard.component';
import { SidebarToggleService } from '../../../services/sidebar-toggle.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { masterService } from '../../../services/master.service';
import { AuthService } from '../../../auth/auth.service';

interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;   // 🔹 String rakha (array ki jagah simple string use karein)
  color?: string;
  children?: MenuItem[];
  roles?: string[];
  expanded?: boolean;
   isLogout?: boolean;
}
@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule, MatTooltipModule   ],
  templateUrl: './layout-sidebar.component.html',
  styleUrl: './layout-sidebar.component.scss'
})
export class LayoutSidebarComponent implements OnInit {
  @Input() isSidebarOpen = true;
  selectedRoute: string = '';
  parsedUserInfo: any;
  userCode: any;
  userType: any;
  userName: any;
  citizenData: any;
  citizenId: any;
  getcitizenId: any;
  mobileNo: any;
  showMenu = false;
  constructor(private router: Router,
     private citizenStore: CitizenStoreService,
     private mobileService: MobileService,
     private masterService: masterService,
    private authService: AuthService) { }
 citizenLinks: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/layout/citizen/dashboard', icon: 'fas fa-home', color: '#ff5722' },    
    { label: 'Register Grievance ', routerLink: '/layout/citizen/add-graviance', icon: 'fas fa-clipboard-list', color: '#3f51b5' },   // Orange
    { label: 'Grievance List', routerLink: '/layout/citizen/graviance-list', icon: 'fas fa-list', color: '#3f51b5' },
    { label: 'Feedback', routerLink: '/layout/citizen/citizen-feedback', icon: 'fa-solid fa-comment', color: '#3f51b5' },
    {label: 'Logout',icon: 'fa fa-sign-out-alt',color: '#f44336',isLogout: true}
  ];

  adminLinks: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/layout/admin/dashboard', icon: 'fa fa-home', color: '#ff5722' },
    { label: 'Review/Update Status', routerLink: '/layout/admin/admin-grievance-list', icon: 'fas fa-list', color: '#e91e63' },
    {label: 'Logout',icon: 'fa fa-sign-out-alt',color: '#f44336',isLogout: true
    }
  ];

  menu: MenuItem[] = [];
  userRole: string = 'citizen' 
  ngOnInit(): void {
       const userInfo = sessionStorage.getItem('userInfo');
       console.log(userInfo, "userInfo");
       
      if (userInfo) {
        this.parsedUserInfo = JSON.parse(userInfo);
        this.userType = Number(this.parsedUserInfo.userType);
        console.log(this.parsedUserInfo, "this.userType");
        
      }
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




// logOut() {

//   this.masterService.isLoggingOut = true;
//   this.masterService
//     .saveAuditLog('LOGOUT', '/login')
//     .subscribe({
//       complete: () => {
//         sessionStorage.clear();
//         this.masterService.isLoggingOut = false;
//         this.router.navigate(['/home']);
//       }
//     });
// }

  logOut() {
    this.authService.logout();
  }

closeSidebarOnClick() {
  if (window.innerWidth <= 768) {
    this.isSidebarOpen = true;
  }
}

}
