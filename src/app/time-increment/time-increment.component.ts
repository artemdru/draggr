import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-time-increment',
  templateUrl: './time-increment.component.html',
  styleUrls: ['./time-increment.component.css']
})
export class TimeIncrementComponent implements OnInit {

	public style: Object = {};
	@Input() date: Date;
	isHour = false;
	isHalfHour = false;
	subscription: Subscription;
	task: Task;
  @ViewChild('timeIncrement') container: ElementRef;

  constructor(private taskService: TaskService) { }

  ngOnInit() {

  	if (this.date.getMinutes() === 0){
  		this.isHour = true;
  		this.style = {
  			'border-top': 'solid silver 1px'
  		}
  	} else if (this.date.getMinutes() === 30){
  		this.isHalfHour = true;
  	}

    this.subscription = this.taskService.taskAdded
      .subscribe(
          (task: Task) => {
            if (task.date === this.date){
              this.task = task;
              console.log(this.task.date);
            }
          }
        );
      this.task = this.taskService.getTaskByDate(this.date);
  }


}
