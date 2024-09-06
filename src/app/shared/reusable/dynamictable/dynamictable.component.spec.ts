import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamictableComponent } from './dynamictable.component';

describe('DynamictableComponent', () => {
  let component: DynamictableComponent;
  let fixture: ComponentFixture<DynamictableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamictableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamictableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
