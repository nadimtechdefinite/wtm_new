import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AccessibilityOption {
  id: string;
  label: string;
  subLabel?: string;
  icon: string;
  active: boolean;
  type: 'toggle' | 'counter' | 'action';
  value?: number;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-accessibility-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div  *ngIf="isOpen()" (click)="closePanel()"></div>

    <!-- Trigger Button -->
    <button class="trigger-btn" (click)="togglePanel()" [class.active]="isOpen()" aria-label="Open Accessibility Panel">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l2 2"/>
      </svg>
      <span>Accessibility</span>
    </button>

    <!-- Panel -->
    <div class="panel" [class.open]="isOpen()" role="dialog" aria-modal="true" aria-label="Accessibility Options">
      <div class="panel-header">
        <div class="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Accessibility
        </div>
        <button class="close-btn" (click)="closePanel()" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="panel-grid">
        @for (option of options(); track option.id) {
          <button
            class="option-card"
            [class.active]="option.active"
            [class.reset-card]="option.id === 'reset'"
            (click)="handleOption(option)"
            [attr.aria-pressed]="option.type === 'toggle' ? option.active : null"
            [attr.aria-label]="option.label"
          >
            <div class="card-inner">
              <div class="icon-wrap" [innerHTML]="option.icon"></div>
              <div class="label-wrap">
                <span class="label">{{ option.label }}</span>
                @if (option.subLabel || option.type === 'counter') {
                  <span class="sub-label">
                    {{ option.type === 'counter' ? getSizeLabel(option.value!) : option.subLabel }}
                  </span>
                }
              </div>
              @if (option.type === 'counter') {
                <div class="counter-controls" (click)="$event.stopPropagation()">
                  <button class="counter-btn" (click)="decrement(option)" [disabled]="option.value === option.min">−</button>
                  <button class="counter-btn" (click)="increment(option)" [disabled]="option.value === option.max">+</button>
                </div>
              }
            </div>
            @if (option.active && option.type === 'toggle') {
              <div class="active-indicator"></div>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #2563eb;
      --primary-light: #eff6ff;
      --border: #e5e7eb;
      --text: #111827;
      --text-muted: #6b7280;
      --bg: #ffffff;
      --shadow: 0 20px 60px rgba(0,0,0,0.15);
      --radius: 16px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.25);
      backdrop-filter: blur(2px);
      z-index: 999;
      animation: fadeIn 0.2s ease;
    }

    .trigger-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 1001;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
      transition: all 0.2s ease;
      letter-spacing: 0.01em;
    }

    .trigger-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(37, 99, 235, 0.5);
    }

    .trigger-btn.active {
      background: #1d4ed8;
    }

    .panel {
      position: fixed;
      bottom: 90px;
      right: 28px;
      width: 380px;
      background: var(--bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      z-index: 1000;
      overflow: hidden;
      transform: translateY(20px) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: all;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid var(--border);
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .panel-title svg {
      color: var(--primary);
    }

    .close-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.15s ease;
    }

    .close-btn:hover {
      background: #e5e7eb;
      color: var(--text);
    }

    .panel-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 16px;
    }

    .option-card {
      position: relative;
      background: #f9fafb;
      border: 1.5px solid var(--border);
      border-radius: 12px;
      padding: 16px 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      overflow: hidden;
    }

    .option-card:hover {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: translateY(-1px);
    }

    .option-card.active {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .option-card.reset-card {
      background: #fff1f1;
      border-color: #fecaca;
    }

    .option-card.reset-card:hover {
      background: #fee2e2;
      border-color: #ef4444;
    }

    .card-inner {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .icon-wrap {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #374151;
    }

    .option-card.active .icon-wrap {
      color: var(--primary);
    }

    .icon-wrap svg {
      width: 24px;
      height: 24px;
    }

    .label-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.2;
    }

    .sub-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .active-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary);
    }

    .counter-controls {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }

    .counter-btn {
      width: 26px;
      height: 26px;
      border: 1.5px solid var(--border);
      border-radius: 6px;
      background: white;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      color: var(--text);
      transition: all 0.15s ease;
    }

    .counter-btn:hover:not(:disabled) {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .counter-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 480px) {
      .panel {
        right: 12px;
        bottom: 80px;
        width: calc(100vw - 24px);
      }
      .trigger-btn {
        right: 16px;
        bottom: 20px;
      }
    }
  `]
})
export class AccessibilityPanelComponent {
  isOpen = signal(false);

  options = signal<AccessibilityOption[]>([
    {
      id: 'textSize',
      label: 'Text Size',
      subLabel: 'normal',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><text x="3" y="18" font-size="14" font-weight="bold" fill="currentColor" stroke="none">A</text><text x="13" y="14" font-size="9" font-weight="bold" fill="currentColor" stroke="none">+</text></svg>`,
      active: false,
      type: 'counter',
      value: 2,
      min: 0,
      max: 4
    },
    {
      id: 'textSpacing',
      label: 'Text Spacing',
      subLabel: 'normal',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
      active: false,
      type: 'counter',
      value: 2,
      min: 0,
      max: 4
    },
    {
      id: 'highlightLinks',
      label: 'Highlight Links',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
      active: false,
      type: 'toggle'
    },
    {
      id: 'darkContrast',
      label: 'Dark Contrast',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
      active: false,
      type: 'toggle'
    },
    {
      id: 'hideImages',
      label: 'Hide Images',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="3" x2="21" y2="21"/></svg>`,
      active: false,
      type: 'toggle'
    },
    {
      id: 'bigCursor',
      label: 'Big Cursor',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3l14 9-7 1-4 7L5 3z"/></svg>`,
      active: false,
      type: 'toggle'
    },
    {
      id: 'invert',
      label: 'Invert',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20" /><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor"/></svg>`,
      active: false,
      type: 'toggle'
    },
    {
      id: 'reset',
      label: 'Reset',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      active: false,
      type: 'action'
    }
  ]);

  getFontSize(value: number): string {
  const sizes = ['12px', '14px', '16px', '18px', '20px'];
  return sizes[value] ?? '16px';
}

getSpacing(value: number): string {
  const spacing = ['0px', '0.5px', '1px', '1.5px', '2px'];
  return spacing[value] ?? '0px';
}
  togglePanel() {
    this.isOpen.update((v: any) => !v);
  }

  closePanel() {
    this.isOpen.set(false);
  }

  handleOption(option: AccessibilityOption) {
    if (option.type === 'action' && option.id === 'reset') {
      this.resetAll();
      return;
    }
    if (option.type === 'toggle') {
      this.options.update((opts: any[]) =>
        opts.map(o => o.id === option.id ? { ...o, active: !o.active } : o)
      );
      this.applyEffect(option.id, !option.active);
    }
  }

  // increment(option: AccessibilityOption) {
  //   this.options.update((opts: any[]) =>
  //     opts.map(o => o.id === option.id && o.value! < o.max!
  //       ? { ...o, value: o.value! + 1, active: o.value! + 1 !== 2 }
  //       : o)
  //   );
  // }

  increment(option: AccessibilityOption) {
  this.options.update((opts: any[]) =>
    opts.map(o => {
      if (o.id === option.id && o.value! < o.max!) {

        const newValue = o.value! + 1;

        if (o.id === 'textSize') {
          document.body.style.fontSize = this.getFontSize(newValue);
        }

        if (o.id === 'textSpacing') {
          document.body.style.letterSpacing = this.getSpacing(newValue);
        }

        return { ...o, value: newValue, active: newValue !== 2 };
      }
      return o;
    })
  );
}

  // decrement(option: AccessibilityOption) {
  //   this.options.update((opts: any[]) =>
  //     opts.map(o => o.id === option.id && o.value! > o.min!
  //       ? { ...o, value: o.value! - 1, active: o.value! - 1 !== 2 }
  //       : o)
  //   );
  // }

  decrement(option: AccessibilityOption) {
  this.options.update((opts: any[]) =>
    opts.map(o => {
      if (o.id === option.id && o.value! > o.min!) {

        const newValue = o.value! - 1;

        if (o.id === 'textSize') {
          document.body.style.fontSize = this.getFontSize(newValue);
        }

        if (o.id === 'textSpacing') {
          document.body.style.letterSpacing = this.getSpacing(newValue);
        }

        return { ...o, value: newValue, active: newValue !== 2 };
      }
      return o;
    })
  );
}

  getSizeLabel(value: number): string {
    const labels = ['x-small', 'small', 'normal', 'large', 'x-large'];
    return labels[value] ?? 'normal';
  }

  resetAll() {
    this.options.update((opts: any[]) =>
      opts.map(o => ({
        ...o,
        active: false,
        value: o.type === 'counter' ? 2 : o.value
      }))
    );
    document.body.style.filter = '';
    document.body.style.fontSize = '';
    document.body.style.letterSpacing = '';
    document.querySelectorAll('a').forEach(a => a.style.removeProperty('text-decoration'));
    document.body.style.cursor = '';
  }

applyEffect(id: string, active: boolean) {

  const body = document.body;

  switch (id) {

    case 'darkContrast':
      if (active) {
        body.classList.add('dark-contrast');
      } else {
        body.classList.remove('dark-contrast');
      }
      break;

    case 'invert':
      if (active) {
        body.classList.add('invert-mode');
      } else {
        body.classList.remove('invert-mode');
      }
      break;

    case 'highlightLinks':
      document.querySelectorAll('a').forEach(a => {
        a.style.textDecoration = active ? 'underline 3px solid #2563eb' : '';
        a.style.backgroundColor = active ? 'yellow' : '';
      });
      break;

    case 'hideImages':
      document.querySelectorAll('img').forEach(img => {
        (img as HTMLElement).style.visibility = active ? 'hidden' : '';
      });
      break;

    case 'bigCursor':
      body.style.cursor = active
        ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'black\' d=\'M5 3l14 9-7 1-4 7L5 3z\'/%3E%3C/svg%3E") 0 0, auto'
        : '';
      break;
  }
}

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closePanel();
  }
}
