import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceListAdminComponent } from './grievance-list-admin.component';

describe('GrievanceListAdminComponent', () => {
  let component: GrievanceListAdminComponent;
  let fixture: ComponentFixture<GrievanceListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
