import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';


@Directive({
  selector: '[appDecimal]'
})
export class DecimalDirective {
  // allow negative and control number of decimals if needed
  @Input('appDecimal') options?: { allowNegative?: boolean; decimals?: number };
  private decimals = 2;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {
    this.options = this.options || {};
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(key)) return;

    const current: string = this.el.nativeElement.value;
    const hasDot = current.includes('.');

    // minus handling
    if (key === '-' && (this.options?.allowNegative)) {
      if (this.el.nativeElement.selectionStart === 0 && !current.startsWith('-')) {
        return;
      } else {
        event.preventDefault();
        return;
      }
    }

    if (key === '.' ) {
      if (hasDot) {
        event.preventDefault();
      }
      return;
    }

    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    } else {
      // if decimals limit reached
      if (hasDot && this.options?.decimals) {
        const parts = current.split('.');
        const fraction = parts[1] || '';
        if (this.el.nativeElement.selectionStart! > current.indexOf('.') && fraction.length >= this.options.decimals) {
          event.preventDefault();
        }
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') ?? '';
    const trimmed = text.trim();
    const re = this.options?.allowNegative ? /^-?\d+(\.\d+)?$/ : /^\d+(\.\d+)?$/;
    if (!re.test(trimmed)) {
      event.preventDefault();
    } else if (this.options?.decimals) {
      const parts = trimmed.split('.');
      if ((parts[1] || '').length > this.options.decimals) {
        event.preventDefault();
      }
    }
  }

  @HostListener('input')
  onInput() {
    let val = this.el.nativeElement.value;
    // remove invalid chars except digits, dot and minus
    const allowNeg = this.options?.allowNegative;
    val = val.replace(/[^\d\.\-]/g, '');
    // keep only first dot
    const firstDotIndex = val.indexOf('.');
    if (firstDotIndex !== -1) {
      val = val.slice(0, firstDotIndex + 1) + val.slice(firstDotIndex + 1).replace(/\./g, '');
    }
    // keep only first minus at start
    if (allowNeg) {
      val = val.replace(/(?!^)-/g, '');
    } else {
      val = val.replace(/-/g, '');
    }

    // enforce decimals length if set
    if (this.options?.decimals && val.includes('.')) {
      const [i, f] = val.split('.');
      val = i + '.' + f.slice(0, this.options.decimals);
    }

    if (val !== this.el.nativeElement.value) {
      this.renderer.setProperty(this.el.nativeElement, 'value', val);
    }
  }
}
