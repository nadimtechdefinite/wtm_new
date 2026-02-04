import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoadersComponent } from './loaders/loaders.component';
import { masterService } from './services/master.service';
import { filter } from 'rxjs';


declare var $: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoadersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'wtm';
  loginDropdownOpen = false;
  constructor(private router: Router,
  private masterService: masterService) {

this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe((event: any) => {

    if (
      this.masterService.isLoggingIn ||
      this.masterService.isLoggingOut
    ) {
      return;
    }

    this.masterService
      .saveAuditLog('VISIT', event.urlAfterRedirects)
      .subscribe();
  });

   }
  ngOnInit() {

  }


}
