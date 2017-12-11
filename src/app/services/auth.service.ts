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

  loggedIn = new Subject<boolean>();
  loggedOut = new Subject<null>();

  constructor(private taskService: TaskService, 
    private http: Http,
    private tutorialService: TutorialService, 
    private incService: TimeIncrementService) { }



  checkIfLoggedIn(){
    return new Promise( (resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // console.log(new Date(firebase.auth().currentUser.metadata.creationTime).getTime());
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => {
                this.token = token;
                this.uid = firebase.auth().currentUser.uid;
                this.taskService.uid = this.uid;
                this.isLoggedIn = true;
                this.taskService.isLoggedIn = true;
                this.getTasks(this.token, this.uid);
                resolve(0);
              }
            )
            .catch((error) => {
              console.log(error);
              resolve(1);
            })
        } else {
          resolve(1);
        }
      });   
    });


    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     firebase.auth().currentUser.getIdToken()
    //       .then(
    //         (token: string) => {
    //           this.token = token;
    //         }
    //       )
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
  }

  registerUser(email: string, password: string){
  	firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => this.loginUser(email, password, true))
  		.catch(
  			(error) => {
          console.log(error);
          this.loggedIn.next(false);
          this.tutorialService.startTutorial();
        }
		  );
  }

  loginUser(email: string, password: string, toStartTutorial: boolean){
  	firebase.auth().signInWithEmailAndPassword(email, password)
  		.then(
  			reponse => {
  				firebase.auth().currentUser.getIdToken()
  					.then(
  						(token: string) => {
  							this.token = token;
                this.uid = firebase.auth().currentUser.uid;
                this.taskService.uid = this.uid;
                this.getTasks(this.token, this.uid);
                this.isLoggedIn = true;
                this.taskService.isLoggedIn = true;
                this.loggedIn.next(true);

                if (!toStartTutorial){
                  this.tutorialService.tutorialProgress = 5;
                  this.tutorialService.completeTutorial(5);
                }
  						}
					)
				console.log("Logged in!");
  			}
		)
		.catch(
			error => {
        console.log(error);
        this.loggedIn.next(false);
        this.tutorialService.startTutorial();
      }
		);
  }

  logoutUser(){
    firebase.auth().signOut().then(() => {
      for (let task of this.taskService.tasks){
        if (task.date !== 1){
          this.incService.unoccupyLastTime(task, task.date, task.time/15);
        }
      }
      this.taskService.nukeTasks();
      this.isLoggedIn = false;
      this.taskService.isLoggedIn = false;
      this.loggedOut.next();
      this.tutorialService.startTutorial();
    },
    (error) => console.log(error));
  }

  getToken() {
  	firebase.auth().currentUser.getIdToken()
  		.then(
			(token: string) => this.token = token
		);
	return this.token;
  }


  getTasks(token: string, uid: string){
    if (this.isLoggedIn){
      firebase.database().ref('tasks/' + uid).once('value').then((snapshot) => {

        if (snapshot.val()){
          for (let task of this.taskService.tasks){
            if (task.date !== 1){
              this.incService.unoccupyLastTime(task, task.date, task.time/15);
            }
          }
          this.taskService.nukeTasks();

          var mod = 0;
          for (let task of snapshot.val().tasks){
            this.taskService.tasks[mod] = new Task(task.id, task.name, task.time, task.date, task.previousDate, task.isComplete);
            this.taskService.emitTask(this.taskService.tasks[mod]);
            mod++;
          }
        }
        

        console.log(this.taskService.tasks);
      });
    }

  }

  updateTasks(){
    if (this.isLoggedIn){
  		firebase.database().ref('tasks/' + this.uid).set({
  			tasks: this.taskService.tasks
  		});
    }
  }
}
