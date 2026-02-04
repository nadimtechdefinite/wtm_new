import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarToggleService {
  private sidebarState = new BehaviorSubject<boolean>(true);
  sidebarState$ = this.sidebarState.asObservable();

  toggle() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  close() {
    this.sidebarState.next(false);
  }

  open() {
    this.sidebarState.next(true);
  }
}
