import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteWrapperComponent } from './website-wrapper.component';

describe('WebsiteWrapperComponent', () => {
  let component: WebsiteWrapperComponent;
  let fixture: ComponentFixture<WebsiteWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
