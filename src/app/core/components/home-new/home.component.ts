import { CommonModule } from '@angular/common';
import {  Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionModule } from "@angular/material/expansion";
import { A11yModule } from "@angular/cdk/a11y";
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatAccordion, MatExpansionPanel, MatExpansionModule, A11yModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeNewComponent {
constructor(private eRef:ElementRef){}
  title = 'wtm';
  loginDropdownOpen = false;
   schemes = [
    {
      name: 'MGNREGA',
      image: '../assets/images/logo/mgnrega.png'
    },
    {
      name: 'NSAP',
      image: '../assets/images/logo/nsap.png'
    },
    {
      name: 'RSETI',
      image: '../assets/images/logo/rseti.png'
    },
    {
      name: 'DDUGKY',
      image: '../assets/images/logo/ddugky.png'
    },
    {
      name: 'PMAYG',
      image: '../assets/images/logo/dash3-pmayg.png'
    }
  ];

  ngOnInit(): void {
  }

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
    setTimeout(() => {
      const carouselElement = document.querySelector('#galleryCarousel');
      if (carouselElement) {
        new bootstrap.Carousel(carouselElement, {
          interval: 3000,
          ride: 'carousel',
          pause: false,
          wrap: true
        });
      }
    }, 0);
  }

}
