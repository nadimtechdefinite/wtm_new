import { CommonModule } from '@angular/common';
import {  Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionModule } from "@angular/material/expansion";
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatAccordion, MatExpansionPanel, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
constructor(private eRef:ElementRef){}
  title = 'wtm';
  loginDropdownOpen = false;
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
