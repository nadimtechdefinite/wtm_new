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

  ngOnInit(){
        const script = document.createElement('script');
    script.src = 'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
    script.async = true;
    document.body.appendChild(script);

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
