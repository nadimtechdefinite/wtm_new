import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGravianceComponent } from './add-graviance.component';

describe('AddGravianceComponent', () => {
  let component: AddGravianceComponent;
  let fixture: ComponentFixture<AddGravianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGravianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGravianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
