import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TaskService } from './task.service';
import { TutorialService } from './tutorial.service';
import { Task } from '../task.model';

// The Time Increment service handles the logic of 'moving' tasks - changing their date, and
// rendering them in a new time increment block. Tasks are rendered on the block with their
// corresponding date, and the task overfills other time increments (if it's >15 minutes).
//
// After task moving, additional time increments are then changed to 'occupied'. All logic
// changing time increments is handled by emitting with the dateSubject observable.

@Injectable()
export class TimeIncrementService {

	// CODES to be supplied in second parameter:
	// 0 - for checking if all increments are unoccupied
	// 1 - for onoccupying increments previously occupied by task being dropped
	// 2 - for occupying new increments
  //                         Task, code,   timeInc, targetTime
	dateSubject = new Subject<[Task, number, number, number]>();

	storedOccupation: boolean;

  constructor(private taskService: TaskService, private tutorialService: TutorialService) { }


  // Moves the task to the time increment with the passed in date.
  // Each code is fired chronologically in this method - first, we check for occupation (CODE 0),
  // then we unoccupy time increments used previously (CODE 1), finally we occupy the new time
  // increments (CODE 2).
  moveTask(task: Task, date: number){
      var timeIncrement: number = date;
      var iterations: number = Math.round(task.time/15);
      var targetDate: number = date;

      // CODE 0:
      // Check if there's enough onoccupied blocks.
      for (var _i = 0; _i < iterations; _i++){
        this.dateSubject.next([task, 0, timeIncrement, targetDate]);
        
        if (this.storedOccupation === true){
          // Time increment is already occupied, not enough room for task.
          return false;
        }

        timeIncrement = timeIncrement + (15*60000); // check the next time increment.
      }


      // CODE 1:
      // Unoccupy previously occupied time increments, if the task was on calendar
      // before being transferred to mouse-container (which has a date of 1).
      if (task.previousDate !== 1){
        timeIncrement = task.date;
        for (var _j = 0; _j < iterations; _j++){
          this.dateSubject.next([task, 1, timeIncrement, targetDate]);
          timeIncrement = timeIncrement + (15*60000); // unoccupy the next time increment.
        }
      }


      // CODE 2:
      // Occupy the target time increments with our task.
      timeIncrement = date;
      for (var _y = 0; _y < iterations; _y++){
        this.dateSubject.next([task, 2, timeIncrement, targetDate]);
        timeIncrement = timeIncrement + (15*60000); // occupy the next time increment.
      }

      // Assign this task to the tutorial to display further tutorials, and
      // complete tutorial 'drag task' section.
      this.tutorialService.tutorialTaskID = task.id;
      this.tutorialService.completeTutorial(2);


      // Write new tasks to database for storage. Done with a delay,
      // as multiple quick changes to tasks might not trigger a write action.
      setTimeout(() => {
        this.taskService.updateTasks();
      }, 500);
 	
  }


  // Stores the occupation status of time increment being iterated through.
  storeOccupationStatus(bool: boolean){
  	this.storedOccupation = bool;
  }


  // Render tasks within time increments and set occupation status after they
  // have been initiated, for example being loaded after scrolling days.
  initTimes(task: Task, date: number){
    var timeIncrement: number = date;
    var iterations: number = task.time/15;

    for (var _y = 0; _y < iterations; _y++){
      this.dateSubject.next([task, 2, timeIncrement, null]);
      timeIncrement = timeIncrement + (15*60000);
    }
  }


  // A method to unoccupy time increments specifically for resizing a task.
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


  // If task was dropped on an element that is not an unoccupied time increment, send task
  // back to it's location before mouse-container (stored in task.previousDate).
  moveTaskToPreviousLocation(){
    if (this.taskService.selectedTask !== null){
      if (this.taskService.selectedTask.previousDate !== 1){
        this.moveTask(this.taskService.selectedTask, this.taskService.selectedTask.previousDate);

        this.taskService.selectedTask.date=this.taskService.selectedTask.previousDate;
        this.taskService.selectedTask.previousDate = 0;
        this.taskService.emitTask(this.taskService.selectedTask);
        this.taskService.selectedTask = null;

      } else if (this.taskService.selectedTask.previousDate === 1){
        this.taskService.sendBackToTaskWindow();
      }     
    }
  }

}
