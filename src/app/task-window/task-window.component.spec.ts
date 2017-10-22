import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskWindowComponent } from './task-window.component';

describe('TaskWindowComponent', () => {
  let component: TaskWindowComponent;
  let fixture: ComponentFixture<TaskWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
