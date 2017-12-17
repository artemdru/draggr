import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';

import { detect } from 'detect-browser';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { TutorialService } from '../services/tutorial.service';

@Component({
  selector: 'app-greeting-dialog',
  templateUrl: './greeting-dialog.component.html',
  styleUrls: ['./greeting-dialog.component.css']
})
export class GreetingDialogComponent implements OnInit {
	@ViewChild('f') loginForm: NgForm;
	@ViewChild('r') registerForm: NgForm;

  // Store the input field values in these variables:
	loginEmail = '';
	loginPassword = '';
	registerEmail = '';
	registerPassword = '';

  // To toggle between showing login screen or signup screen.
  showSignInScreen = false;

  // These booleans trigger logic to show errors.
  showLogInError = false;
  showSignUpError = false;

  browserName: string;
  isMSbrowser: boolean = false;

  loggedIn: Subscription;

  constructor(private taskService: TaskService,
  	private authService: AuthService,
    private tutorialService: TutorialService,
  	public dialogRef: MatDialogRef<GreetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // this.authService.checkIfLoggedIn();

    // Dialog is open, allow users to select elements (for text inputs)
  	this.taskService.isDialogOpen = true;

    // Close greeting-dialog or show error upon login/signup submission
    this.loggedIn = this.authService.loggedIn
      .subscribe(
        (bool: boolean) => {
          if (bool === true) {this.closeDialog();}
          else {this.showLogInError = true; this.showSignUpError = true;}
        }
      );

    // Check if user is using a supported browser
    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }
    if (this.browserName === 'ie' || this.browserName === 'edge'){
      this.isMSbrowser = true;
    }
  }

  submitLogIn(){
  	this.loginEmail = this.loginForm.value.loginData.email;
  	this.loginPassword = this.loginForm.value.loginData.password;

  	this.authService.loginUser(this.loginEmail, this.loginPassword, false);
  }

  submitRegister(){
  	this.registerEmail = this.registerForm.value.registerData.email;
  	this.registerPassword = this.registerForm.value.registerData.password;

  	this.authService.registerUser(this.registerEmail, this.registerPassword);
  }

  closeDialog(){
  	this.dialogRef.close();
  }


  // Toggle between login screen and register screen.
  switchScreens(){
    this.showSignInScreen = !this.showSignInScreen;

    // Remove errors when toggled.
    this.showLogInError = false;
    this.showSignUpError = false;    
  }


  // Enter key submits form: 0 for login, 1 for register.
  onEnter(code: number){
    this.showLogInError = false;
    this.showSignUpError = false;
    if (code === 0) {this.submitLogIn();}
    else if (code === 1) {this.submitRegister();}
  }

}
