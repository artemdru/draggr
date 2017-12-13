import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit, OnDestroy{

	@Input() date: Date;
  task: Task;
  // subscription: Subscription;

	thisDate;
	thisDay;
  incrementedDate: number;
  timeIncrements: number[] = [];

  isToday: boolean = false;

  constructor() { }

  ngOnInit() {
    this.date.setHours(0,0,0,0);
  	
      this.incrementedDate = this.date.getTime();

      for (var _i = 0; _i < 96; _i++){
        this.timeIncrements[_i] = this.incrementedDate;
        this.incrementedDate += 15*60000;
      }

    if (this.date.getDate() == new Date().getDate()){
      this.isToday = true;
    }
  }


  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  // testTask = new Task ('test', 45, this.date);

}
