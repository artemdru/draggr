import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

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
import { DateService } from './date.service';
import { TimeIncrementService } from './time-increment.service';
import { AddTaskDialogComponent } from './task-window/add-task-dialog/add-task-dialog.component';
import { MatDialogModule } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

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
    DayButtonComponent,
    AddTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ResizableModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    TaskService, 
    DateService,
    TimeIncrementService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddTaskDialogComponent]
})
export class AppModule { }
