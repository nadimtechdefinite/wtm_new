import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenFeedbackComponent } from './citizen-feedback.component';

describe('CitizenFeedbackComponent', () => {
  let component: CitizenFeedbackComponent;
  let fixture: ComponentFixture<CitizenFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
