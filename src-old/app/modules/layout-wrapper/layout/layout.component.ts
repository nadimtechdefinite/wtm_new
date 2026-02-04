import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHeaderComponent } from '../layout-header/layout-header.component';
import { LayoutSidebarComponent } from '../layout-sidebar/layout-sidebar.component';
import { LayoutFooterComponent } from '../layout-footer/layout-footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
   imports: [
    RouterOutlet,
    LayoutHeaderComponent,
    LayoutSidebarComponent,
    LayoutFooterComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSidebarOpen = true;



  constructor() {}

  ngonInit() {
    // Initialization logic can go here
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
