import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit, OnDestroy {

	@Input() date: Date;
  task: Task;
  subscription: Subscription;

	thisDate;
	thisDay;
  incrementedDate: Date;
  timeIncrements: Date[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  	
      this.incrementedDate = this.date;

      for (var _i = 0; _i < 96; _i++){
        this.timeIncrements[_i] = this.incrementedDate;
        this.incrementedDate = this.taskService.addMinutesToDate(this.incrementedDate, 15);
      }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // testTask = new Task ('test', 45, this.date);

}
