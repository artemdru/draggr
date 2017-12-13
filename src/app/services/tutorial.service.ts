import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable()
export class TutorialService {

  // TUTORIAL CODES:
	// 1  Start by creating a task!
	// 2  Click on the task to start dragging...
	// 3  Resize the task by dragging at the bottom.
	// 4  Complete the task by clicking here.
	// 5  Stay logged in or sign up to save your progress!
	// 0  NO TUTORIAL

  // Variable that tracks tutorial progress according to codes above.
	public tutorialProgress: number = 0;

  // The task ID of the task that should currently render tutorials 3 and 4.
	public tutorialTaskID: number;

  // Observable that fires when tutorial progresses. Triggers rendering of
  // tutorial step.
	tutorialCompleted = new Subject<number>();

  constructor() { }


  // Start tutorial and render step 1.
  startTutorial(){
    console.log("tutorial started!");
    this.tutorialProgress = 1;
    this.tutorialCompleted.next(this.tutorialProgress);
  }


  // Complete the passed in tutorial step, incrementing up to next
  // tutorial step and rendering it.
  completeTutorial(completed: number){
  	if (this.tutorialProgress === completed) {
  		this.tutorialProgress++;
  		this.tutorialCompleted.next(this.tutorialProgress);

      // End tutorial if step 5 is complete.
  	} else if (this.tutorialProgress === completed && completed === 5){
  		this.tutorialProgress = 0;
  	} 

      // Render step 3 on new task if we've already
      // progressed past step 3.
  	else if (completed === 2 && this.tutorialProgress > 2){
  		this.tutorialCompleted.next(this.tutorialProgress);
  	}
  }

}
