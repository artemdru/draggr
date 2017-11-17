import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-mouse-container',
  templateUrl: './mouse-container.component.html',
  styleUrls: ['./mouse-container.component.css']
})
export class MouseContainerComponent implements OnInit {

 	task: Task;
 	taskSubscription: Subscription;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  	this.taskSubscription = this.taskService.taskAdded
  		.subscribe(
  			(task: Task) => {
  				this.task = task;
  			}
  			);
  }

}
