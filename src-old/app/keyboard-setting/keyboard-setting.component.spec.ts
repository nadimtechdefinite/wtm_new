import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardSettingComponent } from './keyboard-setting.component';

describe('KeyboardSettingComponent', () => {
  let component: KeyboardSettingComponent;
  let fixture: ComponentFixture<KeyboardSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
