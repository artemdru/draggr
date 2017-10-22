import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Task } from './task.model';

@Injectable()
export class TaskService {
	taskAdded = new Subject<Task>();

	tasks=[
	new Task(0, 'browse memes', 30, null),
	new Task(1, 'do chores', 45, null)
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

	emitTask(){
		this.taskAdded.next(this.selectedTask);
	}

	addMinutesToDate(date, minutes){
		return new Date(date.getTime() + minutes*60000);
	}

  constructor() { }

}
