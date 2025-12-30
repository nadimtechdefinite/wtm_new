import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]'
})
export class AlphanumericDirective {
  // allowSpace default false
  @Input('appAlphanumeric') allowSpace = false;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(key)) return;

    const re = this.allowSpace ? /^[A-Za-z0-9\s]$/ : /^[A-Za-z0-9]$/;
    if (!re.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') ?? '';
    const re = this.allowSpace ? /^[A-Za-z0-9\s]*$/ : /^[A-Za-z0-9]*$/;
    if (!re.test(text)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const val = this.el.nativeElement.value;
    const sanitized = this.allowSpace ? val.replace(/[^A-Za-z0-9\s]/g, '') : val.replace(/[^A-Za-z0-9]/g, '');
    if (sanitized !== val) this.renderer.setProperty(this.el.nativeElement, 'value', sanitized);
  }
}
