import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';

import { AppComponent } from './app.component';
import { DateComponent } from './date/date.component';
import { TaskWindowComponent } from './task-window/task-window.component';
import { TaskService } from './task.service';
import { TaskComponent } from './task/task.component';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { TimeIncrementComponent } from './time-increment/time-increment.component';
import { DaysOtwComponent } from './days/days-otw/days-otw.component';
import { TimebarComponent } from './timebar/timebar.component';
import { DayButtonComponent } from './day-button/day-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DateComponent,
    TaskWindowComponent,
    TaskComponent,
    DraggableDirective,
    DroppableDirective,
    TimeIncrementComponent,
    DaysOtwComponent,
    TimebarComponent,
    DayButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ResizableModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
