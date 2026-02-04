import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravianceDetailDialogComponent } from './graviance-detail-dialog.component';

describe('GravianceDetailDialogComponent', () => {
  let component: GravianceDetailDialogComponent;
  let fixture: ComponentFixture<GravianceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GravianceDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GravianceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
