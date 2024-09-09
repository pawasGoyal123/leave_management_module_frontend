import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReqeustCreationComponent } from './leave-reqeust-creation.component';

describe('LeaveReqeustCreationComponent', () => {
  let component: LeaveReqeustCreationComponent;
  let fixture: ComponentFixture<LeaveReqeustCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveReqeustCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveReqeustCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
