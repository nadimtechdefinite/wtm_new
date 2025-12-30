import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/component/header/header.component';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-website-wrapper',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterOutlet],
  templateUrl: './website-wrapper.component.html',
  styleUrl: './website-wrapper.component.scss'
})
export class WebsiteWrapperComponent {

}
