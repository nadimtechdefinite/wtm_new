import { CommonModule } from '@angular/common';
import {  Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionModule } from "@angular/material/expansion";
import { A11yModule } from "@angular/cdk/a11y";
declare var bootstrap: any;
import {Scheme, SCHEMES} from '../../../models/scheme-data'
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
 schemes: readonly Scheme[] = SCHEMES;
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

  get duplicatedSchemes(): Scheme[] {
    return [...this.schemes, ...this.schemes];
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
