import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CitizenStoreService } from '../../../services/citizen-store.service';
import { MobileService } from '../../../services/mobile.service';
import { filter } from 'rxjs';
import { SidebarToggleService } from '../../../services/sidebar-toggle.service';
import { NgZone } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterModule, MatTooltip, MatMenuModule, CommonModule, MatDivider],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  parsedUserInfo: any;
  name: any;
  getUsername: any;
  constructor(private router: Router,
     private citizenStore: CitizenStoreService,
      private ngZone: NgZone,
       private mobileService: MobileService,
        private sidebarToggle: SidebarToggleService,
      private authService: AuthService) { }
  userName: any;
  citizenData: any;
  citizenId: any;
  getcitizenId: any;
  mobileNo: any;
  showMenu = false;
  displayName: string = '';

  logOut() {
    this.authService.logout();
  }

toggleMenu() {
  this.showMenu = !this.showMenu;
}
  ngOnInit() {
  // this.loadCitizenDetails();
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
    // const script = document.createElement('script');
    // script.src = 'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
    // script.async = true;
    // document.body.appendChild(script);
  // 1️⃣ pehle fetch intercept
  this.interceptBhashiniLanguage();

  const script = document.createElement('script');
  script.src =
    'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
  script.async = true;
  document.body.appendChild(script);

  window.addEventListener('bhashiniLanguageChanged', (event: any) => {
    console.log('FINAL SELECTED:', event.detail);
  });
  }


private isLanguageLocked = false;
interceptBhashiniLanguage() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.body) {
      try {
        const body =
          typeof init.body === 'string'
            ? JSON.parse(init.body)
            : null;

        if (body?.targetLanguage && !this.isLanguageLocked) {
          const code = body.targetLanguage;

          const langMap: any = {
          en: 'English',
          as: 'Assamese (অসমীয়া)',
          bn: 'Bengali (বাংলা)',
          brx: 'Bodo (बड़ो)',
          doi: 'Dogri (डोगरी)',
          gom: 'Goan Konkani (गोवा कोंकणी)',
          gu: 'Gujarati (ગુજરાતી)',
          hi: 'Hindi (हिन्दी)',
          kn: 'Kannada (ಕನ್ನಡ)',
          ks: 'Kashmiri (कश्मीरी)',
          mai: 'Maithili (मैथिली)',
          ml: 'Malayalam (മലയാളം)',
          mni: 'Manipuri (মণিপুরী)',
          mr: 'Marathi (मराठी)',
          ne: 'Nepali (नेपाली)',
          or: 'Odia (ଓଡ଼ିଆ)',
          pa: 'Punjabi (ਪੰਜਾਬੀ)',
          sa: 'Sanskrit (संस्कृत)',
          sat: 'Santali (संताली)',
          sd: 'Sindhi (سنڌي)',
          ta: 'Tamil (தமிழ்)',
          te: 'Telugu (తెలుగు)',
          ur: 'Urdu (اردو)'
        };

          this.name = langMap[code] || code;
          console.log('Language Code:', code);
          console.log('Language Name:', this.name);

          window.dispatchEvent(
            new CustomEvent('bhashiniLanguageChanged', {
              detail: { code, name: this.name }
            })
          );
        }
      } catch {
      
      }
    }

    return originalFetch(input, init);
  };
}


  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

}

