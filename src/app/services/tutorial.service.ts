import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

@Injectable()
export class TutorialService {

	//Start by creating a new task!					1
	//Click on the task to start dragging			2
	//Resize the task by dragging at the bottom		3
	//Complete the task by clicking here.			4
	//Sign up or log in to save your progress!		5
	//No tutorial									0

	public tutorialProgress: number = 0;

	public tutorialTaskID: number;

	tutorialCompleted = new Subject<number>();

  constructor() { }

  startTutorial(){
    console.log("tutorial started!");
    this.tutorialProgress = 1;
    this.tutorialCompleted.next(this.tutorialProgress);
  }

  completeTutorial(completed: number){
  	if (this.tutorialProgress === completed) {
  		this.tutorialProgress++;
  		this.tutorialCompleted.next(this.tutorialProgress);
  	} else if (this.tutorialProgress === completed && completed === 5){
  		this.tutorialProgress = 0;
  	} 
  	else if (completed === 2 && this.tutorialProgress > 2){
  		this.tutorialCompleted.next(this.tutorialProgress);
  	}
  }

}
