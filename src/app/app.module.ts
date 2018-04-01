import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ResizableModule } from 'angular-resizable-element';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { AppComponent } from './app.component';
import { DateComponent } from './date/date.component';
import { TaskWindowComponent } from './task-window/task-window.component';
import { TaskComponent } from './task/task.component';
import { TimeIncrementComponent } from './time-increment/time-increment.component';
import { DaysOtwComponent } from './days-otw/days-otw.component';
import { TimebarComponent } from './timebar/timebar.component';
import { DayButtonComponent } from './day-button/day-button.component';
import { AddTaskDialogComponent } from './task-window/add-task-dialog/add-task-dialog.component';
import { MouseContainerComponent } from './mouse-container/mouse-container.component';
import { PresentIndicatorComponent } from './date/present-indicator/present-indicator.component';
import { GreetingDialogComponent } from './greeting-dialog/greeting-dialog.component';

import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';
import { TutorialService } from './services/tutorial.service';
import { DateService } from './services/date.service';
import { TimeIncrementService } from './services/time-increment.service';

@NgModule({
  declarations: [
    AppComponent,
    DateComponent,
    TaskWindowComponent,
    TaskComponent,
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
    HttpClientModule,
    MalihuScrollbarModule.forRoot()
  ],
  providers: [
    TaskService, 
    DateService,
    TimeIncrementService,
    AuthService,
    TutorialService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddTaskDialogComponent,
  GreetingDialogComponent]
})
export class AppModule { }
