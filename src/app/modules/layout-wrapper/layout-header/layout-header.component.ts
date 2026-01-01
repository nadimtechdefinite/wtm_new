import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CitizenStoreService } from '../../../services/citizen-store.service';
import { MobileService } from '../../../services/mobile.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {
  parsedUserInfo: any;
  constructor(private router:Router, private citizenStore: CitizenStoreService,private mobileService: MobileService,){}
  userName:any;
   citizenData: any;
     citizenId: any;
  getcitizenId: any;
    mobileNo: any;
    showMenu = false;
    
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

if (userInfo) {
  this.parsedUserInfo = JSON.parse(userInfo);
  console.log(this.parsedUserInfo.citizenId, "parsedUserInfo");
  
}
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
        }
      });
  });
}


}
