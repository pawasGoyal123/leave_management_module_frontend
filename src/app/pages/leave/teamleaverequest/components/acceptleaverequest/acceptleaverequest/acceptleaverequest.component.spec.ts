import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptleaverequestComponent } from './acceptleaverequest.component';

describe('AcceptleaverequestComponent', () => {
  let component: AcceptleaverequestComponent;
  let fixture: ComponentFixture<AcceptleaverequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptleaverequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptleaverequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
