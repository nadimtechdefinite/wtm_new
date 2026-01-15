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
     selectedLanguageName: string = 'English';
    
logOut(){
  sessionStorage.clear();
   this.router.navigate(['/login']);
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

  // 2️⃣ phir bhashini script load
  const script = document.createElement('script');
  script.src =
    'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
  script.async = true;
  document.body.appendChild(script);

  // 3️⃣ custom event listen
  window.addEventListener('bhashiniLanguageChanged', (event: any) => {
    console.log('FINAL SELECTED:', event.detail);
  });
  }


// interceptBhashiniLanguage() {
//   const originalFetch = window.fetch.bind(window);

//   window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
//     // 🔍 request body read
//     if (init?.body) {
//       try {
//         const body =
//           typeof init.body === 'string'
//             ? JSON.parse(init.body)
//             : null;

//         if (body?.targetLanguage) {
//           const code = body.targetLanguage;


//           const langMap: any = {
//             en: 'English',
//             as: 'Assamese',
//             bn: 'Bengali',
//             brx: 'Bodo',
//             doi: 'Dogri',
//             gom: 'Goan Konkani',
//             gu: 'Gujarati',
//             hi: 'Hindi',
//             kn: 'Kannada',
//             ks: 'Kashmiri',
//             mai: 'Maithili',
//             ml: 'Malayalam',
//             mni: 'Manipuri',
//             mr: 'Marathi',
//             ne: 'Nepali',
//             or: 'Odia',
//             pa: 'Punjabi',
//             sa: 'Sanskrit',
//             sat: 'Santali',
//             sd: 'Sindhi',
//             ta: 'Tamil',
//             te: 'Telugu',
//             ur: 'Urdu'
//           };


 
//           this.name = langMap[code] || code;

//           console.log('Language Code:', code);
//           console.log('Language Name:', this.name);

//           window.dispatchEvent(
//             new CustomEvent('bhashiniLanguageChanged', {
//               detail: { code, name }
//             })
//           );
//         }
//       } catch {
//         // ignore
//       }
//     }

//     return originalFetch(input, init);
//   };
// }


// loadCitizenDetails() {
//   this.mobileService.updatelogindata$.subscribe(value => {
//     if (!value || !value.data) return;

//     this.getcitizenId = value.data.citizenId;
//     this.mobileNo = value.data.mobileNo;

//     // 🔥 Call API only after values are ready
//     this.citizenStore.loadCitizenDetails(this.getcitizenId, this.mobileNo);
//     // Subscribe to citizen data
//     this.citizenStore.citizenDetails$
//       .pipe(filter((data: any) => data !== null))
//       .subscribe(data => {
//         if(data.messageCode === 1){
//         console.log('Citizen Data:', data);
//         this.citizenData = data;
//         this.userName = data?.name; // agar aapko name chahiye
//         sessionStorage.setItem('username', this.userName);
//         }
//       });
//   });
// }
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
          const name = langMap[code] || code;
        this.selectedLanguageName = name;

          // 🔒 lock kar diya
          this.isLanguageLocked = true;

          console.log('Language Code:', code);
          console.log('Language Name:', this.name);

          window.dispatchEvent(
            new CustomEvent('bhashiniLanguageChanged', {
              detail: { code, name: this.name }
            })
          );
        }
      } catch {
        // ignore
      }
    }

    return originalFetch(input, init);
  };
}


  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

}

