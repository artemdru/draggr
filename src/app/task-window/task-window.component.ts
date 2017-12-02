import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { detect } from 'detect-browser';

import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-task-window',
  templateUrl: './task-window.component.html',
  styleUrls: ['./task-window.component.css']
})
export class TaskWindowComponent implements OnInit {

	tasks: Task[];

  taskSubscription: Subscription;

  public scrollbarOptions = {};

  browserName: string;

  searchValue: string = '';

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit() {
  	this.tasks=this.taskService.tasks;

    this.taskSubscription = this.taskService.taskRefresher
      .subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
        }
      );

    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }

    if (this.browserName === 'firefox'){
      this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 300, scrollbarPosition: 'inside' };
    }
  }

  openDialog(){
    let dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '750px',
      height: '500px'
    });

    // this.taskService.getTasks();
  }

  onDrop(event){
    console.log(event);
  }

  onMouseUp(){

    if (this.taskService.selectedTask !== null && !this.taskService.selectedTask.isComplete){
      this.taskService.sendBackToTaskWindow();  
    } else if (this.taskService.selectedTask !== null && this.taskService.selectedTask.isComplete){
      console.log("mouseup");        
      this.taskService.deleteTask(this.taskService.selectedTask.id);
    }
  }

  onKey(searchValue: string){
    this.searchValue = searchValue.toLowerCase();
  }
  
}