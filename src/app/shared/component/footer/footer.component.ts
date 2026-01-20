import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SortlinkDialogComponent } from '../sortlink-dialog/sortlink-dialog.component';
import { A11yModule } from "@angular/cdk/a11y";
declare var $: any;
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDialogModule, A11yModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements AfterViewInit {

  title = 'wtm';
  loginDropdownOpen = false;

  todayDate: string = '';

constructor(private eRef:ElementRef, private dialog:MatDialog){}

  ngOnInit(): void {
      this.todayDate = new Date().toLocaleDateString('en-GB');

    // Bhashini translation plugin
    const script = document.createElement('script');
    script.src = 'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';
    script.async = true;
    document.body.appendChild(script);
  }
  logos: string[] = [
    '/assets/images/clients/Darpan-logo.png',
    '/assets/images/clients/pg-portal.png',
    '/assets/images/clients/india-gov.png',
    '/assets/images/clients/data-gov.png',
    '/assets/images/clients/mygov.png',
    '/assets/images/clients/digital-india.png',
    '/assets/images/clients/eci.png',
    '/assets/images/clients/myvisit-logo.png',
    '/assets/images/clients/e-gazette.png',
    '/assets/images/clients/makeinindia.png',
    '/assets/images/clients/naco.png',
    '/assets/images/clients/goidirectory.png',
    '/assets/images/clients/India_code.png',
    '/assets/images/clients/IDY-Austin-Logo1_0.png',
    '/assets/images/clients/Logo_resize.png'
  ];
  toggleLoginDropdown(event: Event) {
    event.stopPropagation();
    this.loginDropdownOpen = !this.loginDropdownOpen;
  }

  closeDropdown() {
    this.loginDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.loginDropdownOpen = false;
    }
  }
  ngAfterViewInit(): void {
    // $('.logo-slider').slick({
    //   slidesToShow: 7,
    //   slidesToScroll: 1,
    //   autoplay: true,
    //   autoplaySpeed: 0,
    //   speed: 4000,
    //   cssEase: 'linear',
    //   infinite: true,
    //   arrows: false,
    //   dots: false,
    //   pauseOnHover: true,
    //   pauseOnFocus: true,
    //   responsive: [
    //     { breakpoint: 1200, settings: { slidesToShow: 5 } },
    //     { breakpoint: 992, settings: { slidesToShow: 4 } },
    //     { breakpoint: 768, settings: { slidesToShow: 3 } },
    //     { breakpoint: 576, settings: { slidesToShow: 2 } }
    //   ]
    // });
  }




  openDialog(type: string, title:any) {
    debugger
  this.dialog.open(SortlinkDialogComponent, {
    width: '600px',
    data: {
      type:type,
      title:title
    },
  });
}

}

