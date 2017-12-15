import { Component, OnInit, Input } from '@angular/core';


import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../services/task.service';
import { TimeIncrementService } from '../services/time-increment.service';

import * as $ from 'jquery';


@Component({
  selector: 'app-mouse-container',
  templateUrl: './mouse-container.component.html',
  styleUrls: ['./mouse-container.component.css']
})
export class MouseContainerComponent implements OnInit {
 	task: Task;
 	taskSubscription: Subscription;

  constructor(private taskService: TaskService, private incService: TimeIncrementService) { }

  ngOnInit() {
  	this.taskSubscription = this.taskService.mouseContainer
  		.subscribe(
  			([task, taskX, taskY, mouseX, mouseY]: [Task, number, number, number, number]) => {

          let initialWidth;
          let initialHeight;

          if (task.previousDate === 1){
            initialWidth = $('.task-window').width()*0.8;
            initialHeight = 130;
          } else initialHeight = ((task.time/15)*32)-6;

  				this.task = task;

          // Render task at offset calculated by coordinates passed in from observable,
          // positioning task directly over where the task just was. Then, move to
          // mouse container.
          $('.animate-mouse').css({width: initialWidth, height: initialHeight, left: taskX-mouseX-20, top: -1*(20+mouseY-taskY)});
          $('.animate-mouse').animate({width: '90%', height: ((task.time/15)*32)-6, left: 0, top: 0}, 200);
  			}
  			);
  }

  onMouseUp(){
    this.incService.moveTaskToPreviousLocation();
  }

}
