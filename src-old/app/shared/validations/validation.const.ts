
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export const VALIDATION_PATTERNS = {
  NUMBER_ONLY: /^[0-9]*$/,
  DECIMAL: /^[0-9]*\.?[0-9]*$/,
  CHAR_ONLY_WITH_SPACE: /^[A-Za-z\s]*$/,
  CHAR_ONLY: /^[A-Za-z]*$/,
  ALPHANUMERIC: /^[A-Za-z0-9]*$/,
  ALPHANUMERIC_WITH_SPACE: /^[A-Za-z0-9\s]*$/,
  NO_SPECIAL: /^[A-Za-z0-9\s\-_]*$/
};


export type ValidationPatternKey = keyof typeof VALIDATION_PATTERNS;

export function fromInputEvent(element: HTMLInputElement | HTMLTextAreaElement, wait = 300) {
  return (source$: Observable<Event>) =>
    source$.pipe(
      debounceTime(wait),
      map((ev: any) => {
        const value = (ev.target as HTMLInputElement).value;
        return value;
      })
    );
}
export function validateValue(value: string, patternKey: ValidationPatternKey): boolean {
  const pattern = VALIDATION_PATTERNS[patternKey];
  if (!pattern) return false;
  return pattern.test(value);
}
