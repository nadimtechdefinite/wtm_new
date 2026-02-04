import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortlinkDialogComponent } from './sortlink-dialog.component';

describe('SortlinkDialogComponent', () => {
  let component: SortlinkDialogComponent;
  let fixture: ComponentFixture<SortlinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortlinkDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortlinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
