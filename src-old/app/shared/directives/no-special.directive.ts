import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNoSpecial]'
})
export class NoSpecialDirective {
  // allow underscore and hyphen by default
  @Input('appNoSpecial') allowDashUnderscore = true;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];
    if (allowedKeys.includes(key)) return;

    const base = 'A-Za-z0-9\\s';
    const extras = this.allowDashUnderscore ? '\\-_': '';
    const re = new RegExp('^[' + base + extras + ']$');
    if (!re.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') ?? '';
    const base = 'A-Za-z0-9\\s';
    const extras = this.allowDashUnderscore ? '\\-_': '';
    const re = new RegExp('^[' + base + extras + ']*$');
    if (!re.test(text)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const val = this.el.nativeElement.value;
    const sanitized = this.allowDashUnderscore ? val.replace(/[^A-Za-z0-9\s\-_]/g, '') : val.replace(/[^A-Za-z0-9\s]/g, '');
    if (sanitized !== val) this.renderer.setProperty(this.el.nativeElement, 'value', sanitized);
  }
}
