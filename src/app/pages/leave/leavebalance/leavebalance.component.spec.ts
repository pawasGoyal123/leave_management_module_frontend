import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavebalanceComponent } from './leavebalance.component';

describe('LeavebalanceComponent', () => {
  let component: LeavebalanceComponent;
  let fixture: ComponentFixture<LeavebalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavebalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavebalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
