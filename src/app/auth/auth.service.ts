import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Http, Response } from '@angular/http';

import { TaskService } from '../task.service';

@Injectable()
export class AuthService {
	token: string;
	uid: string;

  constructor(private taskService: TaskService, private http: Http) { }

  registerUser(email: string, password: string){
  	firebase.auth().createUserWithEmailAndPassword(email, password)
  		.catch(
  			error => console.log(error)
		)
  }

  loginUser(email: string, password: string){
  	firebase.auth().signInWithEmailAndPassword(email, password)
  		.then(
  			reponse => {
  				firebase.auth().currentUser.getIdToken()
  					.then(
  						(token: string) => {
  							this.token = token;
  							this.uid = firebase.auth().currentUser.uid;
  							this.getTasks(this.token, this.uid);
  						}
					)
				console.log("we're logged in!");
  			}
		)
		.catch(
			error => console.log(error)
		);
  }

  getToken() {
  	firebase.auth().currentUser.getIdToken()
  		.then(
			(token: string) => this.token = token
		);
	return this.token;
  }


  getTasks(token: string, uid: string){
  	firebase.database().ref('tasks/' + uid).once('value').then(function(snapshot){
  		console.log(snapshot.val());
  	});

  	// this.http.get('https://draggr-73506.firebaseio.com/tasks/' + uid + '/' + )

		// this.http.get('https://draggr-73506.firebaseio.com/tasks.json?auth=' + token)
		// 	.map(
		// 		(response: Response) => {
		// 			const tasks: Task[] = response.json();
		// 			return tasks;
		// 		}
		// 	)
		// 	.subscribe(
		// 		(tasks: Task[]) => {
		// 			for (let task of tasks){
		// 				if (task !== null){
		// 					this.tasks.push(new Task(task.id, task.name, task.time, new Date(task.date), new Date(task.previousDate), task.isComplete));
		// 				}
		// 			}
					
		// 			console.log(this.tasks);
		// 			for (let task of this.tasks){
		// 				this.emitTask(task);
		// 			}
		// 			this.nextTaskID = this.tasks[this.tasks.length-1].id + 1;
		// 		}
		// 	);
  }

  updateTasks(){
  		const storingTasks = [];
  		var mod = 0;

  		//store dates as their integer value for firebase

  		for (let task of this.taskService.taskArray()){
  			storingTasks[mod] = task;
  			console.log(storingTasks);
  			mod++;
  		}

  		firebase.database().ref('tasks/' + this.uid).set({
  			tasks: storingTasks
  		});
		// const token = this.authService.getToken();
		// this.http.put('https://draggr-73506.firebaseio.com/tasks.json?auth=' + token, this.tasks)
		// 	.subscribe(
		// 		(response: Response) => {
		// 			console.log(response);
		// 		}
		// 		);
  }
}
