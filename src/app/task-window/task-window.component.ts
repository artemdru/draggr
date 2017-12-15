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

  // Unchecker for options menu that gets changed whenever we mousedown on screen.
  @Input() unchecker: boolean;

	tasks: Task[];

  taskSubscription: Subscription;

  loggedOut: Subscription;

  tutorialSubscription: Subscription;

  public scrollbarOptions = {};

  browserName: string;

  searchValue: string = '';

  // Trigger to show options menu.
  showMenu: boolean = false;
  // Allows or disallows the trigger to show menu be changed.
  showMenuIsChangeable: boolean = true;

  isLoggedIn: boolean;

  tutorialProgress: number;

  constructor(private taskService: TaskService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    public dialog: MatDialog) { }


  // OnChanges triggers when unchecker has been switched, which happens whenever
  // we mousedown on the screen.
  ngOnChanges(){
    // Close menu and do not allow menuClicked() to change the showMenu bool, since
    // it would otherwise trigger as well on a mousedown, reopening the menu.
    if (this.showMenu){
      this.showMenuIsChangeable = false;
      this.showMenu = false;
    }

    // Allow menuClicked() to toggle menu again.
    setTimeout(() => {
      this.showMenuIsChangeable = true;
    }, 300);
  }

  ngOnInit() {
    // Load tasks.
  	this.tasks=this.taskService.tasks;


    // Open greeting-dialog when user logs out.
    this.loggedOut = this.authService.loggedOut
      .subscribe(() => {
        this.openGreetingDialog();
      }
      );


    // Reload tasks when this fires (usually when tasks are added
    // back to task-window).
    this.taskSubscription = this.taskService.taskRefresher
      .subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
        }
      );


    // Render tutorials as tutorial progresses.
    this.tutorialSubscription = this.tutorialService.tutorialCompleted
      .subscribe(
        (progress: number) => {
          this.tutorialProgress = progress;
        }
      );
    this.tutorialProgress = this.tutorialService.tutorialProgress;


    // Get browser name to render a suitable task list (non-webkit browsers
    // need MalihuScrollbar to hide the scrollbar on task list).
    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }
    if (this.browserName === 'firefox'){
      this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 300, scrollbarPosition: 'inside' };
    }


    // Store login status for rendering logic on options menu:
    // Whether to render "Log out" or "Log in/Sign up".
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {this.isLoggedIn = true;}
      else {this.isLoggedIn = false;}
    })
  }


  // Open add task dialog.
  openDialog(){
    let dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '750px',
      height: '500px'
    });

    // User is not allowed to highlight/select elements when dialogs are closed.
    // To prevent from dragging elements while dragging a task.
    dialogRef.afterClosed()
      .subscribe(
        () => { this.taskService.isDialogOpen = false; }
      );
  }


  // Triggered when a task is dropped on task-window.
  // Add task to task-list if dragged task is incomplete. Delete task if dragged task is complete.
  onMouseUp(){
    if (this.taskService.selectedTask !== null && !this.taskService.selectedTask.isComplete){
      this.taskService.sendBackToTaskWindow();  
    } else if (this.taskService.selectedTask !== null && this.taskService.selectedTask.isComplete){       
      this.taskService.deleteTask(this.taskService.selectedTask.id);
    }
  }


  // Modify search results when user enters value to search input.
  onKey(searchValue: string){
    this.searchValue = searchValue.toLowerCase();
  }


  // Log user out and hide options menu.
  logoutUser(){
    this.authService.logoutUser();
    this.showMenu = false;
  }


  // Open greeting dialog. Fired after logging user out.
  openGreetingDialog(){
    this.showMenu = false;

    let dialogRef = this.dialog.open(GreetingDialogComponent, {
      width: '750px',
      height: '500px'
    });

    // User is not allowed to highlight/select elements when dialogs are closed.
    // To prevent from dragging elements while dragging a task.
    dialogRef.afterClosed()
      .subscribe(
        () => { this.taskService.isDialogOpen = false; }
      );
  }


  // Show/hide options menu.
  menuClicked(){
    if (this.showMenuIsChangeable) this.showMenu = !this.showMenu;
    this.tutorialService.completeTutorial(5);
  }
  
}