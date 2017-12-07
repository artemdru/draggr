import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TutorialService {

	//Start by creating a new task!					1
	//Click on the task to start dragging			2
	//Resize the task by dragging at the bottom		3
	//Complete the task by clicking here.			4
	//Sign up or log in to save your progress!		5
	//No tutorial									0

	public tutorialProgress: number = 1;

	tutorialCompleted = new Subject<number>();

  constructor() { }

  completeTutorial(completed: number){
  	if (this.tutorialProgress === completed) {
  		this.tutorialProgress++;
  		this.tutorialCompleted.next(this.tutorialProgress);
  	} else if (completed === 5){
  		this.tutorialProgress = 0;
  	}
  }

}
