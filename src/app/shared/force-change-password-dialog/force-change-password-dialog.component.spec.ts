import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceChangePasswordDialogComponent } from './force-change-password-dialog.component';

describe('ForceChangePasswordDialogComponent', () => {
  let component: ForceChangePasswordDialogComponent;
  let fixture: ComponentFixture<ForceChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForceChangePasswordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForceChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
