import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoPaste]',
  standalone: true
})
export class NoPasteDirective {

  constructor() { }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}
