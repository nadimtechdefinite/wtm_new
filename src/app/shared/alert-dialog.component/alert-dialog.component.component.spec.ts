import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogComponentComponent } from './alert-dialog.component.component';

describe('AlertDialogComponentComponent', () => {
  let component: AlertDialogComponentComponent;
  let fixture: ComponentFixture<AlertDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
