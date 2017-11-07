import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Task } from './task.model';

@Injectable()
export class TaskService {
	taskAdded = new Subject<Task>();

	tasks=[
	new Task(0, 'implement thing', 30, null),
	new Task(1, 'meeting', 45, null)
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

  constructor() { }

}
