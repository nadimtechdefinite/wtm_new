import { Component, HostListener, OnInit } from '@angular/core';
import { LayoutFooterComponent } from "../modules/layout-wrapper/layout-footer/layout-footer.component";
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-keyboard-setting',
  standalone: true,
  imports: [LayoutFooterComponent, MatTooltip, MatMenuModule, CommonModule, RouterLink],
  templateUrl: './keyboard-setting.component.html',
  styleUrl: './keyboard-setting.component.scss'
})
export class KeyboardSettingComponent implements OnInit {
name: any;
  ngOnInit(){
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

  skipToMain() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth' });
  }
}

  
showFontMenu = false;
fontSize = 100; // base %



toggleFontMenu(event: Event) {
   event.stopPropagation();
  this.showFontMenu = !this.showFontMenu;

}

@HostListener('document:click')
closeOnOutsideClick() {
  if (this.showFontMenu) {
    this.showFontMenu = false;
  }
}

fontIncrease() {
  if (this.fontSize < 120) {
    this.fontSize += 10;
    this.applyFontSize();
  }
}

fontDecrease() {
  if (this.fontSize > 90) {
    this.fontSize -= 10;
    this.applyFontSize();
  }
}

fontNormal() {
  this.fontSize = 100;
  this.applyFontSize();
}

applyFontSize() {
  document.documentElement.style.fontSize = this.fontSize + '%';
}

  confirmRedirect(url: string) {
    const confirmMsg = `You will be redirected to an external website.
The Ministry of Rural Development will not be responsible for the content available on this website.
Are you sure you want to proceed?`;
    if (confirm(confirmMsg)) {
      window.open(url, '_blank');
    }
  }
}
