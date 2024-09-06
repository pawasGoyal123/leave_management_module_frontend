import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleaveregisterComponent } from './teamleaveregister.component';

describe('TeamleaveregisterComponent', () => {
  let component: TeamleaveregisterComponent;
  let fixture: ComponentFixture<TeamleaveregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamleaveregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamleaveregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
