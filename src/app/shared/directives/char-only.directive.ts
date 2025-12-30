import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCharOnly]'
})
export class CharOnlyDirective {
  // allowSpace default true
  @Input('appCharOnly') allowSpace = true;

  private regex = this.allowSpace ? /^[A-Za-z\s]*$/ : /^[A-Za-z]*$/;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(key)) return;

    const re = this.allowSpace ? /^[A-Za-z\s]$/ : /^[A-Za-z]$/;
    if (!re.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboard = event.clipboardData?.getData('text') ?? '';
    const re = this.allowSpace ? /^[A-Za-z\s]*$/ : /^[A-Za-z]*$/;
    if (!re.test(clipboard)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const val = this.el.nativeElement.value;
    const sanitized = this.allowSpace ? val.replace(/[^A-Za-z\s]/g, '') : val.replace(/[^A-Za-z]/g, '');
    if (sanitized !== val) this.renderer.setProperty(this.el.nativeElement, 'value', sanitized);
  }
}
