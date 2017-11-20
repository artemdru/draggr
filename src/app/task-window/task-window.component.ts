import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-task-window',
  templateUrl: './task-window.component.html',
  styleUrls: ['./task-window.component.css']
})
export class TaskWindowComponent implements OnInit {


	timeInputs = [15, 30, 45, 60];

	tasks: Task[];

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit() {
  	this.tasks=this.taskService.tasks;
  }

  openDialog(){
    let dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '750px',
      height: '500px'
    });
  }

  onDrop(event){
    console.log(event);
  }
  
}