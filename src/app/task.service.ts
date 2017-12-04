import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Task } from './task.model';

@Injectable()
export class TaskService {

  constructor(private http: Http) { }

	taskAdded = new Subject<Task>();
	mouseContainer = new Subject<[Task, number, number, number, number]>();

	taskRefresher = new Subject<Task[]>();

	isDialogOpen: boolean = false;

	tasks: Task[] = [];

	selectedTask: Task = null;

	public nextTaskID: number;

	updateTasks(){
		this.http.put('https://draggr-73506.firebaseio.com/tasks.json', this.tasks)
			.subscribe(
				(response: Response) => {
					console.log(response);
				}
				);
	}

	getTasks(){
		this.http.get('https://draggr-73506.firebaseio.com/tasks.json')
			.map(
				(response: Response) => {
					const tasks: Task[] = response.json();
					return tasks;
				}
			)
			.subscribe(
				(tasks: Task[]) => {
					for (let task of tasks){
						if (task !== null){
							this.tasks.push(new Task(task.id, task.name, task.time, new Date(task.date), new Date(task.previousDate), task.isComplete));
						}
					}
					
					console.log(this.tasks);
					for (let task of this.tasks){
						this.emitTask(task);
					}
					this.nextTaskID = this.tasks[this.tasks.length-1].id + 1;
				}
			);
	}

	getNewTaskID(){
		return this.nextTaskID;
	}

	getTaskArrayPos(taskID: number){
		let _i = 0;
		for (let task of this.tasks){
			if (task.id === taskID){
				return _i;
			}
		_i++;	
		}
	}

	addTask(task: Task){
		this.tasks.push(task);
		this.nextTaskID++;
		console.log(this.tasks);

		this.updateTasks();
	}

	selectTask(taskNumb: number){
		this.selectedTask=this.tasks[this.getTaskArrayPos(taskNumb)];

	}

	emitTask(task: Task){
		this.taskAdded.next(task);
	}

	addMinutesToDate(date, minutes){
		return new Date(date.getTime() + minutes*60000);
	}

	getTaskByDate(date: Date){
		for (let task of this.tasks){
			if (task.date.getTime() !== 1){
				if (task.date.getTime() === date.getTime()){
					return task;
				}
			}
		}
	}

	addToMouseContainer(id: number, taskX: number, taskY:number, mouseX: number, mouseY: number){
		this.selectTask(id);
		this.selectedTask.previousDate = this.selectedTask.date;
		this.selectedTask.date = new Date(0);
		this.mouseContainer.next([this.tasks[this.getTaskArrayPos(id)], taskX, taskY, mouseX, mouseY]);
	}

	sendBackToTaskWindow(){
		this.selectedTask.date = new Date(1);
		this.taskRefresher.next(this.tasks);
		this.selectedTask.previousDate = new Date(1);
		this.selectedTask = null;
	}

	deleteTask(taskID: number){
		let i = this.getTaskArrayPos(taskID);

		if (this.tasks[i].date.getTime() !== 1){
		this.emitTask(new Task(undefined, null, null, this.tasks[i].date, new Date(1), null));
		}


		if (this.selectedTask !== null){
			this.mouseContainer.next([new Task(undefined, null, null, new Date(0), new Date(1), null), 0, 0, 0, 0]);
		}
		this.tasks.splice(i, 1);
		this.selectedTask = null;
		console.log(this.tasks);

		this.updateTasks();
	}

	


}
