import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIncrementComponent } from './time-increment.component';

describe('TimeIncrementComponent', () => {
  let component: TimeIncrementComponent;
  let fixture: ComponentFixture<TimeIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
