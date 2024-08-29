import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttendanceLayoutComponent } from './my-attendance-layout.component';

describe('MyAttendanceLayoutComponent', () => {
  let component: MyAttendanceLayoutComponent;
  let fixture: ComponentFixture<MyAttendanceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAttendanceLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAttendanceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
