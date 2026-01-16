import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltip } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatTooltip, MatMenuModule ],
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

}
