import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TaskService } from './task.service';
import { Task } from './task.model';

@Injectable()
export class TimeIncrementService {

	// SUBJECT CODES for first variable sent:
	// 0 - for checking if all increments are unoccupied, and if increments are occupied by same task being moved
	// 1 - for onoccupying increments previously occupied by task being dropped
	// 2 - for occupying new increments
	// First number is code
  //                         Task, code,   timeInc, targetTime
	dateSubject = new Subject<[Task, number, number, number]>();

	storedOccupation: boolean;
	moveSuccessful: boolean = false;

  constructor(private taskService: TaskService) { }

  moveTask(task: Task, date: Date){
  	this.moveSuccessful = false;
  	var timeIncrement: number = date.getTime();
  	var iterations: number = task.time/15; //TODO: proper calculations from time to integers
    var targetDate: number = date.getTime();

  	// check if there's enough onoccupied blocks
  	for (var _i = 0; _i < iterations; _i++){
  		this.dateSubject.next([task, 0, timeIncrement, targetDate]);
  		
  		if (this.storedOccupation === true){
  			console.log("not enough room for task");
  			return false;
  		}

  		timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
  	}

  	// unoccupy previous time increments, if the task had any
  	if (task.date !== null){
  		timeIncrement = task.date.getTime();
  		for (var _j = 0; _j < iterations; _j++){
  			this.dateSubject.next([task, 1, timeIncrement, targetDate]);
  			timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
  		}
  	}

  	// occupy the new time increments
  	timeIncrement = date.getTime();
  	for (var _y = 0; _y < iterations; _y++){
  		this.dateSubject.next([task, 2, timeIncrement, targetDate]);
  		timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
  	}

  	console.log("enough room for task!");

  	this.moveSuccessful = true;
  }

  storeOccupationStatus(bool: boolean){
  	this.storedOccupation = bool;
  }

  initTimes(task: Task, date: Date){
    var timeIncrement: number = date.getTime();
    var iterations: number = task.time/15; //TODO: proper calculations from time to integers

    for (var _y = 0; _y < iterations; _y++){

      this.dateSubject.next([task, 2, timeIncrement, null]);
      timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
    }
  }

  unoccupyLastTime(task: Task, date: Date){
    var timeIncrement: number = task.date.getTime() + ((task.time-15)*60000);

        this.dateSubject.next([task, 1, timeIncrement, null]);
  }

}
