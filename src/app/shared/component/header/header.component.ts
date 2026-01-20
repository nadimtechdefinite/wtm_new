import { Component, OnInit } from '@angular/core';
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

  constructor() { }

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

toggleFontMenu() {
  this.showFontMenu = !this.showFontMenu;
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
}
