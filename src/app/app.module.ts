import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

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
import { MouseContainerComponent } from './mouse-container/mouse-container.component';
import { PresentIndicatorComponent } from './date/present-indicator/present-indicator.component';
import { GreetingDialogComponent } from './greeting-dialog/greeting-dialog.component';
import { HttpModule } from '@angular/http';

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
    AddTaskDialogComponent,
    MouseContainerComponent,
    PresentIndicatorComponent,
    GreetingDialogComponent
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
    MatInputModule,
    HttpModule,
    MalihuScrollbarModule.forRoot()
  ],
  providers: [
    TaskService, 
    DateService,
    TimeIncrementService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddTaskDialogComponent,
  GreetingDialogComponent]
})
export class AppModule { }
