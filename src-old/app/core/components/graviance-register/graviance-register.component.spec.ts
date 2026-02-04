import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravianceRegisterComponent } from './graviance-register.component';

describe('GravianceRegisterComponent', () => {
  let component: GravianceRegisterComponent;
  let fixture: ComponentFixture<GravianceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GravianceRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GravianceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
