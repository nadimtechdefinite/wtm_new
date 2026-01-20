import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltip } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatTooltip, MatMenuModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    /** -----------------------------
     *  BHASHINI TRANSLATION PLUGIN
     * ----------------------------- */
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
