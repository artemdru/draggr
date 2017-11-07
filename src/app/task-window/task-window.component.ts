import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

	taskForm: FormGroup;

	timeInputs = [15, 30, 45, 60];

	tasks: Task[];

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit() {
  	this.tasks=this.taskService.tasks;

  	this.taskForm = new FormGroup({
  		'task-name': new FormControl(null, Validators.required),
  		'task-time': new FormControl(null, Validators.required)
  	});
  }

  onSubmit(){
    var newTask = new Task(
      this.taskService.getNewTaskID(),
      this.taskForm.get('task-name').value,
      this.taskForm.get('task-time').value,
      null
      );

    this.taskService.addTask(newTask);
  }

  openDialog(){
    let dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '750px',
      height: '500px'
    });
  }
  
}