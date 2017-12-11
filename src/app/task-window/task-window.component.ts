import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { detect } from 'detect-browser';

import * as firebase from 'firebase';

import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { TutorialService } from '../services/tutorial.service';
import { Task } from '../task.model';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { GreetingDialogComponent } from '../greeting-dialog/greeting-dialog.component';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-task-window',
  templateUrl: './task-window.component.html',
  styleUrls: ['./task-window.component.css']
})
export class TaskWindowComponent implements OnInit, OnChanges {

  @Input() unchecker: boolean;

	tasks: Task[];

  taskSubscription: Subscription;

  loggedOut: Subscription;

  tutorialSubscription: Subscription;

  public scrollbarOptions = {};

  browserName: string;

  searchValue: string = '';

  showMenu: boolean = false;
  showMenuIsChangeable: boolean = true;
  isLoggedIn: boolean;

  tutorialProgress: number;

  constructor(private taskService: TaskService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    public dialog: MatDialog) { }

  ngOnChanges(){
      
      if (this.showMenu){
        this.showMenuIsChangeable = false;
        this.showMenu = false;
      }
      setTimeout(() => {
        this.showMenuIsChangeable = true;
      }, 300);
    //listens to mousedown anywhere on app

    // if (this.showMenuIsChangeable) {this.showMenu = false;} 
  }

  ngOnInit() {
  	this.tasks=this.taskService.tasks;

    this.loggedOut = this.authService.loggedOut
      .subscribe( () => {
        this.openGreetingDialog();
      }
      );

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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {this.isLoggedIn = true;}
      else {this.isLoggedIn = false;}
    })


    this.tutorialSubscription = this.tutorialService.tutorialCompleted
      .subscribe(
        (progress: number) => {
          this.tutorialProgress = progress;
        }
      );
    this.tutorialProgress = this.tutorialService.tutorialProgress;

  }

  openDialog(){
    let dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '750px',
      height: '500px'
    });

    dialogRef.afterClosed()
      .subscribe(
        () => { this.taskService.isDialogOpen = false; }
      );
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

  logoutUser(){
    this.authService.logoutUser();
    this.showMenu = false;
  }

  openGreetingDialog(){
    this.showMenu = false;

    let dialogRef = this.dialog.open(GreetingDialogComponent, {
      width: '750px',
      height: '500px'
    });

    dialogRef.afterClosed()
      .subscribe(
        () => { this.taskService.isDialogOpen = false; }
      );
  }

  menuClicked(){
    // console.log(this.showMenuIsChangeable);
    // if (this.showMenuIsChangeable && this.showMenu){
    //   this.showMenuIsChangeable = false;
    //   this.showMenu = !this.showMenu;
    //   setTimeout(() => {
    //     this.showMenuIsChangeable = true;
    //   }, 1500);
    // } else this.showMenu = false;

    if (this.showMenuIsChangeable) this.showMenu = !this.showMenu;

    console.log("firing taskwindow");
    this.tutorialService.completeTutorial(5);
  }
  
}