import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { VALIDATION_PATTERNS } from '../validations/validation.const';


@Directive({
  selector: '[appNumberOnly]',
  standalone:true
})
export class NumberOnlyDirective {
  // allow negative numbers? default false
  @Input('appNumberOnly') allowNegative = false;

  private regex = VALIDATION_PATTERNS.NUMBER_ONLY;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(event.key)) return;

    // allow minus if configured and at start
    if (this.allowNegative && event.key === '-' && (this.el.nativeElement.selectionStart === 0)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboard = event.clipboardData?.getData('text') ?? '';
    const candidate = clipboard.trim();
    // if allowing negative, accept leading '-' and digits
    const re = this.allowNegative ? /^-?[0-9]+$/ : /^[0-9]+$/;
    if (!re.test(candidate)) {
      event.preventDefault();
    }
  }

  // optional: sanitize if model updated programmatically
  @HostListener('input')
  onInput() {
    const val = this.el.nativeElement.value;
    const sanitized = val.replace(/[^0-9\-]/g, '');
    if (!this.allowNegative) {
      if (sanitized !== val) this.renderer.setProperty(this.el.nativeElement, 'value', sanitized.replace(/-/g, ''));
    } else {
      // allow single leading minus
      const sanitized2 = sanitized.replace(/(?!^)-/g, '');
      if (sanitized2 !== val) this.renderer.setProperty(this.el.nativeElement, 'value', sanitized2);
    }
  }
}
