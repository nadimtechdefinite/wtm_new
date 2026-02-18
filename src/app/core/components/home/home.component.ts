import { CommonModule } from '@angular/common';
import {  Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionModule } from "@angular/material/expansion";
import { MatTooltip } from "@angular/material/tooltip";
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatAccordion, MatExpansionPanel, MatExpansionModule, MatTooltip],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
constructor(private eRef:ElementRef){}
  title = 'wtm';
  loginDropdownOpen = false;
  images: string[] = [
    'photo-1.jpg',
    'photo-11.jpg',
    'photo-2.jpg',
    'photo-12.jpg',
    'photo-3.jpg',
    'photo-14.jpg',
    'photo-4.jpg',
    'photo-16.jpg',
    'photo-6.jpg',
    'photo-15.jpg',
    'photo-9.jpg',
    'photo-10.jpg',
    'photo-5.jpg',
    'photo-7.jpg',
    'photo-8.jpg',
    'photo-13.jpg',
    'photo-17.jpg',
    'photo-18.jpg',
    'photo-19.jpg',
    'photo-20.jpg',
    'photo-21.jpg',
    'photo-22.jpg',
    'photo-23.jpg',
    'photo-24.jpg',
    'photo-25.jpg',
    'photo-26.jpg'
  ];

   schemes = [
    {
      name: 'MGNREGA',
      title: 'Mahatma Gandhi National Rural Employment Guarantee Act',
      logo: 'mgnrega.png',
      url: 'https://nrega.dord.gov.in/'
    },
    {
      name: 'NSAP',
      title: 'National Social Assistance Programme',
      logo: 'nsap.png',
      url: 'https://nsap.dord.gov.in/'
    },
    {
      name: 'RSETI',
      title: 'Rural Self Employment Training Institutes',
      logo: 'rseti.png',
      url: 'https://kaushal.dord.gov.in/'
    },
    {
      name: 'DDUGKY',
      title: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
      logo: 'ddugky.png',
      url: 'https://kaushal.dord.gov.in/'
    },
    {
      name: 'PMAYG',
      title: 'Pradhan Mantri Awaas Yojana - Gramin',
      logo: 'dash3-pmayg.png',
      url: 'https://pmayg.dord.gov.in/'
    },
    {
      name: 'PMGSY',
      title: 'Pradhan Mantri Gram Sadak Yojana',
      logo: 'dash2-pmgsy.png',
      url: 'https://pmgsy.nic.in/'
    },
    {
      name: 'NRLM',
      title: 'Deendayal Antayodaya Yojana - NRLM',
      logo: 'dash1-nrlm.png',
      url: 'https://kaushal.dord.gov.in/'
    },
    {
      name: 'SAGY',
      title: 'Saansad Adarsh Gram Yojana',
      logo: 'logo-sagy.png',
      url: 'https://saanjhi.dord.gov.in/'
    },
    {
      name: 'DISHA',
      title: 'District Development Coordination & Monitoring Committees',
      logo: 'disha.jpg',
      url: 'https://disha.gov.in/disha/'
    }
  ];

selectedIndex: number | null = null;
openZoom(index: number) {
  this.selectedIndex = index;
}

closeZoom() {
  this.selectedIndex = null;
}

  // Infinite scroll ke liye duplicate array
  get duplicatedSchemes() {
    return [...this.schemes, ...this.schemes];
  }
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
