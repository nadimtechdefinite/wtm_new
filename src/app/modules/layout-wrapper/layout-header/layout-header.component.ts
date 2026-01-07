import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CitizenStoreService } from '../../../services/citizen-store.service';
import { MobileService } from '../../../services/mobile.service';
import { filter } from 'rxjs';
import { SidebarToggleService } from '../../../services/sidebar-toggle.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {
    @Output() toggleSidebarEvent = new EventEmitter<void>();

  parsedUserInfo: any;
  name: any;
  getUsername: any;
  constructor(private router:Router, private citizenStore: CitizenStoreService,private mobileService: MobileService, private sidebarToggle: SidebarToggleService){}
  userName:any;
   citizenData: any;
     citizenId: any;
  getcitizenId: any;
    mobileNo: any;
    showMenu = false;
   displayName: string = '';
    
logOut(){
  sessionStorage.clear();
   this.router.navigate(['/login']);
}

toggleMenu() {
  this.showMenu = !this.showMenu;
}
  ngOnInit() {
  this.loadCitizenDetails();
   const userInfo = sessionStorage.getItem('userInfo');
   const resdata = sessionStorage.getItem('name');
   if(resdata){
     this.getUsername = JSON.parse(resdata);
   }
   
   

if (userInfo) {
  this.parsedUserInfo = JSON.parse(userInfo);
  console.log(this.parsedUserInfo.citizenId, "parsedUserInfo");
  
}

if (userInfo) {
    this.parsedUserInfo = JSON.parse(userInfo);
    if (this.parsedUserInfo.userType === 1 || this.parsedUserInfo.userType === 2) {
      this.displayName = this.parsedUserInfo.loginName;
    }
    else if (this.parsedUserInfo.citizenName) {
      this.displayName = this.parsedUserInfo.citizenName;
    }
  }

    /** -----------------------------
     *  BHASHINI TRANSLATION PLUGIN
     * ----------------------------- */
    const script = document.createElement('script');
    script.src = 'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
    script.async = true;
    document.body.appendChild(script);

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
        if(data.messageCode === 1){
        console.log('Citizen Data:', data);
        this.citizenData = data;
        this.userName = data?.name; // agar aapko name chahiye
        sessionStorage.setItem('username', this.userName);
        }
      });
  });
}


  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

}

