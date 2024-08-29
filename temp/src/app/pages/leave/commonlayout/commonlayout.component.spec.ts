import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonlayoutComponent } from './commonlayout.component';

describe('CommonlayoutComponent', () => {
  let component: CommonlayoutComponent;
  let fixture: ComponentFixture<CommonlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonlayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
