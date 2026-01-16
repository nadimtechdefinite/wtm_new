import { Component, OnInit } from '@angular/core';
import { LayoutFooterComponent } from "../modules/layout-wrapper/layout-footer/layout-footer.component";

@Component({
  selector: 'app-keyboard-setting',
  standalone: true,
  imports: [LayoutFooterComponent],
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
}
