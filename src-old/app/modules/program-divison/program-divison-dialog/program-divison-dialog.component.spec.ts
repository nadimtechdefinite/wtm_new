import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramDivisonDialogComponent } from './program-divison-dialog.component';

describe('ProgramDivisonDialogComponent', () => {
  let component: ProgramDivisonDialogComponent;
  let fixture: ComponentFixture<ProgramDivisonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramDivisonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramDivisonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
