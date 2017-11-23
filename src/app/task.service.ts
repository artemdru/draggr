import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Task } from './task.model';

@Injectable()
export class TaskService {
	taskAdded = new Subject<Task>();
	mouseContainer = new Subject<[Task, number, number, number, number]>();

	taskRefresher = new Subject<Task[]>();

	isDialogOpen: boolean = false;

	tasks=[
	new Task(0, 'Implement flux capacitator marginal dynamicism in quantum field', 60, null, null, false),
	new Task(1, 'Stand-up Meeting', 45, null, null, false),
	new Task(2, 'Write unit test for tasks', 75, null, null, false),
	new Task(3, 'Debug task snapping on complete', 45, null, null, false),

	];

	selectedTask: Task = null;

	public nextTaskID: number;

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
			if (task.date !== null){
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
		this.selectedTask.date = null;
		this.taskRefresher.next(this.tasks);
		this.selectedTask.previousDate = null;
		this.selectedTask = null;
	}

	deleteTask(taskID: number){
		let i = this.getTaskArrayPos(taskID);

		if (this.tasks[i].date !== null){
		this.emitTask(new Task(undefined, null, null, this.tasks[i].date, null, null));
		}


		if (this.selectedTask !== null){
			this.mouseContainer.next([new Task(undefined, null, null, new Date(0), null, null), 0, 0, 0, 0]);
		}
		this.tasks.splice(i, 1);
		this.selectedTask = null;
		console.log(this.tasks);
	}

  constructor() { }

}
