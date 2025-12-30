import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravianceListComponent } from './graviance-list.component';

describe('GravianceListComponent', () => {
  let component: GravianceListComponent;
  let fixture: ComponentFixture<GravianceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GravianceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GravianceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
