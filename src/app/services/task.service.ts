import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as firebase from 'firebase';

import { Task } from '../task.model';

@Injectable()
export class TaskService {

  constructor(private http: Http) { }

	// Store all tasks in this array.
	tasks: Task[] = [];

  	// Observable that fires to render task in a time increment.
	taskAdded = new Subject<Task>();

	// Observable that fires when a task is added to mouse-container,
	// passing in current coordinates of the task and of the mouse.
	mouseContainer = new Subject<[Task, number, number, number, number]>();

	// Observable that fires for task-window (tasks with no assigned time-increment)
	// to render tasks.
	taskRefresher = new Subject<Task[]>();

	// Stores whether a dialog is open. If false, disallow user from highlighting
	// text or images so dragging tasks does not accidentally highlight and drag
	// unwanted objects.
	isDialogOpen: boolean = false;

	// Variable for easy access to currently selected task to be moved.
	selectedTask: Task = null;

	// Stores user login status and user ID.
	isLoggedIn: boolean = false;
	uid: string;


	// Writes the current task list in TaskService to firebase.
	// Duplicate method in AuthService to avoid circular dependency.
	updateTasks(){
	    if (this.isLoggedIn){
	  		firebase.database().ref('tasks/' + this.uid).set({
	  			tasks: this.tasks
	  		})
	  		.then(() => console.log("Saved tasks!"))
	  		.catch(error => {console.log("Unable to add tasks to firebase..."); console.log(error)});
	    }
  	}


  	// Returns a unique task ID to be used for a newly created task.
	getNewTaskID(){
		if (this.tasks.length > 0) { return this.tasks[this.tasks.length-1].id + 1; } else return 0;
	} /* TODO: handle integer overflow */


	// Get position of task in array with task ID.
	getTaskArrayPos(taskID: number){
		let _i = 0;
		for (let task of this.tasks){
			if (task.id === taskID){
				return _i;
			}
		_i++;	
		}
	} /* TODO: write faster search algorithm */


	// Add task to task array and write to firebase.
	addTask(task: Task){
		this.tasks.push(task);
		this.updateTasks();
	}


	// Select a task with given task ID.
	// selectedTask is used for easy access to task being moved.
	selectTask(taskID: number){
		this.selectedTask=this.tasks[this.getTaskArrayPos(taskID)];
	}


	// Fire observable to render task in time increment.
	emitTask(task: Task){
		this.taskAdded.next(task);
	}


	// Used by time increments to find a task with their exact time
	// increment assignment (aka date).
	getTaskByDate(date: number){
		for (let task of this.tasks){
			if (task.date > 1){
				if (task.date === date){
					return task;
				}
			}
		}
	}


	// Adds task to mouse container, which is a container floating with the mouse, to
	// simulate dragging and dropping.
	addToMouseContainer(id: number, taskX: number, taskY:number, mouseX: number, mouseY: number){
		this.selectTask(id);

		// Store the tasks current date to return to it if dropped on something
		// other than an unoccupied time increment.
		this.selectedTask.previousDate = this.selectedTask.date;

		// The mouse container's designated date value is 0. Set out task's date to 0.
		this.selectedTask.date = 0;

		// Render task in the mouse container, animate with our task's and mouse's coordinates.
		this.mouseContainer.next([this.tasks[this.getTaskArrayPos(id)], taskX, taskY, mouseX, mouseY]);
	}


	// Adds selectedTask to task-window, which renders all tasks of a date of 1.
	sendBackToTaskWindow(){
		this.selectedTask.date = 1;

		// Render tasks in task-window
		this.taskRefresher.next(this.tasks);
		this.selectedTask.previousDate = 1;

		// Free up selectedTask, so we can use logic that requires there to not
		// be a task we're currently moving.
		this.selectedTask = null;
	}


	// First, the current element containing task with given task ID renders no task.
	// Then, we remove the task from the tasks array and update our firebase.
	deleteTask(taskID: number){
		let i = this.getTaskArrayPos(taskID);

		// Render no task in the current tasks time increment.
		if (this.tasks[i].date !== 1){
		this.emitTask(new Task(undefined, null, null, this.tasks[i].date, 1, '#00A651', null));
		}

		// Tasks may also be deleted if they are dropped in the task-window as completed
		// tasks. In this case, the task to be deleted is selectedTask, and is thus located
		// in the mouse-container. Render no task in mouse-container.
		if (this.selectedTask !== null){
			this.mouseContainer.next([new Task(undefined, null, null, 0, 1, '#00A651', null), 0, 0, 0, 0]);
		}

		// Remove task from tasks array.
		this.tasks.splice(i, 1);

		// Free up selectedTask, so we can use logic that requires there to not
		// be a task we're currently moving.
		this.selectedTask = null;
		
		// Write current task-list to firebase.
		this.updateTasks();
	}


	// First, render no task in each task's time-increment.
	// Then, delete all tasks from tasks array.
	nukeTasks(){
		// Render no task in time increments by sending tasks
		// to task-window.
		for (let task of this.tasks){
			if (task.date !== 1){
				this.selectTask(task.id);
				this.sendBackToTaskWindow();
			}
		}

		// Empty tasks array.
		this.tasks = [];

		// Render no tasks in task-window.
		this.taskRefresher.next(this.tasks);
	}

}
