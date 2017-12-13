import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { TimeIncrementService } from '../services/time-increment.service';
import { TaskService } from '../services/task.service';
import { TutorialService } from '../services/tutorial.service';
import { Task } from '../task.model';

@Injectable()
export class AuthService {
	token: string;
	uid: string;
  isLoggedIn: boolean = false;


  // Observable that fires when a user is attempted to log in, or upon checking if user is logged in.
  // Used for logic in the greeting dialog (sign-up and login window):
  // emits true if user is logged in.
  // emits false if user was not logged in or not signed up after form submission.
  loggedIn = new Subject<boolean>();


  // Observable that fires when a user is logged out.
  // Used for logic in the task-window to open a greeting dialog when fired.
  loggedOut = new Subject<null>();

  constructor(private taskService: TaskService, 
    private http: Http,
    private tutorialService: TutorialService, 
    private incService: TimeIncrementService) { }


  // Checks if user is logged in. Returns a promise to the component calling it
  // (the app component).
  checkIfLoggedIn(){
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => {

                // Store token and userID
                this.token = token;
                this.uid = firebase.auth().currentUser.uid;

                // Store userID and login status in TaskService
                // to avoid circular dependency.
                this.taskService.uid = this.uid;
                this.taskService.isLoggedIn = true;

                // Store login status locally to determine whether
                // or not to attempt to write/read tasks.
                this.isLoggedIn = true;

                // Read tasks from firebase
                this.getTasks(this.token, this.uid);

                // User is logged in, so resolve to app-component not to
                // open a greeting-dialog.
                console.log(firebase.auth().currentUser.email + " is logged in!");
                resolve(0);
              }
            )
            .catch((error) => {
              console.log("Was Not able to connect to the firebase...");
              console.log(error);
              resolve(1);
            })
        } else {
          // User is not logged in, so resolve to app-component to open a
          // greeting-dialog.
          resolve(1);
        }
      });   
    });
  }


  // Signs a user up in the firebase. Logs them in if sign-up is successful.
  registerUser(email: string, password: string){
  	firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => this.loginUser(email, password, true)) // Log in user after signing up
  		.catch(
  			(error) => {
          console.log("Unable to sign up user...");
          console.log(error);
          this.loggedIn.next(false);

          // Unable to sign up user, so start the tutorial for demo users.
          this.tutorialService.startTutorial();
        }
		  );
  }

  // Log user in. Accepts bool parameter whether or not to start tutorial after logging in.
  // When this method is fired through log in or sign up through greeting-dialog, this
  // parameter is passed in as true.
  // When this method is fired through checkIfLoggedIn(), the parameter is passed in as false.
  loginUser(email: string, password: string, toStartTutorial: boolean){
  	firebase.auth().signInWithEmailAndPassword(email, password)
  		.then(
  			reponse => {
  				firebase.auth().currentUser.getIdToken()
  					.then(
  						(token: string) => {

                // Store user token and userID
  							this.token = token;
                this.uid = firebase.auth().currentUser.uid;

                // Store userID and login status in TaskService
                // to avoid circular dependency.
                this.taskService.uid = this.uid;
                this.taskService.isLoggedIn = true;

                // Store login status locally to determine whether
                // or not to attempt to write/read tasks.
                this.isLoggedIn = true;

                // Read tasks from firebase.
                this.getTasks(this.token, this.uid);

                // Fire observable to close greeting-dialog
                this.loggedIn.next(true);

                // Starts tutorial if method was fired from greeting-dialog.
                if (!toStartTutorial){
                  this.tutorialService.tutorialProgress = 5;
                  this.tutorialService.completeTutorial(5);
                }

				        console.log(email + " is logged in!");
              }
            );
  			}
		)
		.catch(
			error => {
        console.log(email + " was unable to log in...");
        console.log(error);
        this.loggedIn.next(false);

        // User was not able to log in, start tutorial for demo users.
        this.tutorialService.startTutorial();
      }
		);
  }


  // Logs the user out and deletes all tasks in the TaskService.
  logoutUser(){
    firebase.auth().signOut().then(() => {

      // Unoccupies all time increments occupied by current tasks.
      for (let task of this.taskService.tasks){
        if (task.date !== 1){
          this.incService.unoccupyLastTime(task, task.date, task.time/15);
        }
      }

      // Removes all tasks from TaskService.
      this.taskService.nukeTasks();

      // Store login status locally to determine whether
      // or not to attempt to write/read tasks.
      this.isLoggedIn = false;

      // Store login status in TaskService to avoid circular dependency.
      this.taskService.isLoggedIn = false;

      // User has been logged out, so open greeting-dialog.
      this.loggedOut.next();

      // Begin tutorial for demo users.
      this.tutorialService.startTutorial();
    },
    (error) => {console.log("Unable to log out..."); console.log(error)});
  }

  // TODO: utilize tokens for user authorization if security is an issue.
  /*
    getToken() {
    	firebase.auth().currentUser.getIdToken()
    		.then(
  			(token: string) => this.token = token
  		);
  	return this.token;
    }
  */


  // Reads tasks from firebase with given user ID.
  getTasks(token: string, uid: string){
    // Only proceeds if user is logged in.
    if (this.isLoggedIn){
      firebase.database().ref('tasks/' + uid).once('value').then((snapshot) => {

        // If user already has tasks, then delete all tasks in TaskService put there by demo user.
        // Otherwise (if user has just registered and been logged in), keep the tasks they have
        // created.
        if (snapshot.val()){
          for (let task of this.taskService.tasks){
            if (task.date !== 1){
              this.incService.unoccupyLastTime(task, task.date, task.time/15);
            }
          }
          this.taskService.nukeTasks();

          var _i = 0;
          for (let task of snapshot.val().tasks){
            // Create a new task object to store task, since tasks are stored as JSON in firebase.
            this.taskService.tasks[_i] = new Task(task.id, task.name, task.time, task.date, task.previousDate, task.isComplete);

            // Render the task.
            this.taskService.emitTask(this.taskService.tasks[_i]);
            _i++;
          }

          console.log("Got tasks from firebase!");
        } else this.updateTasks(); // Write tasks put by demo user if user has just been registered.
      });
    }
  }   /* TODO: Rather than download all tasks of the user, download ones of which dates are currently rendered. Implement logic to download tasks as dates are initiated, rather than as the app is initiated. */


  // Writes the current task list in TaskService to firebase.
  // Duplicate method in TaskService to avoid circular dependency.
  updateTasks(){
    if (this.isLoggedIn){
  		firebase.database().ref('tasks/' + this.uid).set({
  			tasks: this.taskService.tasks
  		})
      .then(() => console.log("Saved tasks!"))
      .catch(error => {console.log("Unable to add tasks to firebase..."); console.log(error)});
    }
  }
}
