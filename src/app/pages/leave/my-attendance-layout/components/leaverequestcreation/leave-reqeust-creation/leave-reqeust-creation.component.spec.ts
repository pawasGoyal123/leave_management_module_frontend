import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestCreationComponent } from './leave-reqeust-creation.component';

describe('LeaveReqeustCreationComponent', () => {
  let component: LeaveRequestCreationComponent;
  let fixture: ComponentFixture<LeaveRequestCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestCreationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
