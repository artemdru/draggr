import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Task } from './task.model';

@Injectable()
export class TaskService {
	taskAdded = new Subject<Task>();

	taskRefresher = new Subject<any>();

	tasks=[
	new Task(0, 'Implement flux capacitator marginal dynamicism in quantum field', 60, null),
	new Task(1, 'Stand-up Meeting', 45, null)
	];

	selectedTask: Task;

	getNewTaskID(){
		return this.tasks.length;
	}

	addTask(task: Task){
		this.tasks.push(task);
	}

	selectTask(taskNumb: number){
		this.selectedTask=this.tasks[taskNumb];
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

	refreshTaskViews(){
		this.taskRefresher.next(0);
	}

  constructor() { }

}
