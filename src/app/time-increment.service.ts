import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TaskService } from './task.service';
import { TutorialService } from './tutorial.service';
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

  constructor(private taskService: TaskService, private tutorialService: TutorialService) { }

  moveTask(task: Task, date: number){
      this.moveSuccessful = false;
      var timeIncrement: number = date;
      var iterations: number = Math.round(task.time/15); //TODO: proper calculations from time to integers
      var targetDate: number = date;


      // check if there's enough onoccupied blocks
      for (var _i = 0; _i < iterations; _i++){
        this.dateSubject.next([task, 0, timeIncrement, targetDate]);
        
        if (this.storedOccupation === true){
          // console.log("not enough room for task");
          return false;
        }

        timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
      }

      // unoccupy previous time increments, if the task had any
      if (task.previousDate !== 1){
        timeIncrement = task.date;
        for (var _j = 0; _j < iterations; _j++){
          this.dateSubject.next([task, 1, timeIncrement, targetDate]);
          timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
        }
      }

      // occupy the new time increments
      timeIncrement = date;
      for (var _y = 0; _y < iterations; _y++){
        this.dateSubject.next([task, 2, timeIncrement, targetDate]);
        timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
      }

      // console.log("enough room for task!");

      this.moveSuccessful = true;
      this.tutorialService.completeTutorial(2);
      // task.previousDate = date;
      // console.log(this.taskService.tasks);

      setTimeout(() => {
        this.taskService.updateTasks();
      }, 500);
 	
  }

  storeOccupationStatus(bool: boolean){
  	this.storedOccupation = bool;
  }

  initTimes(task: Task, date: number){
    var timeIncrement: number = date;
    var iterations: number = task.time/15; //TODO: proper calculations from time to integers

    for (var _y = 0; _y < iterations; _y++){

      this.dateSubject.next([task, 2, timeIncrement, null]);
      timeIncrement = timeIncrement + (15*60000); //TODO: proper calculations from time to integers
    }
  }

  unoccupyLastTime(task: Task, date: number, iterations: number){

    // Iterating multiple times is necessary because the onResize event can skip firing if task
    // is resized too quickly. The iterations passed in are the amount of blocks that are being
    // unoccupied in one onResize event, in case it skipped a few.

    for (var _x = 0; _x < iterations; _x++){
        var modifier = _x*15;

        var timeIncrement: number = task.date + ((task.time-15-modifier)*60000);

        this.dateSubject.next([task, 1, timeIncrement, null]);
    }


  }

}
