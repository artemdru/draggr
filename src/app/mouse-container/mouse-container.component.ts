import { Component, 
OnInit,
Input,
trigger,
state,
style,
transition,
animate} from '@angular/core';

import { useAnimation } from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { TimeIncrementService } from '../time-increment.service';

import * as $ from 'jquery';


@Component({
  selector: 'app-mouse-container',
  templateUrl: './mouse-container.component.html',
  styleUrls: ['./mouse-container.component.css'],
  animations: [
    trigger('taskState', [
      state('left', style({
        transform: 'translateX(-100px)'
      })),
      state('centered', style({
        transform: 'translateX(0px)'
      })),
      transition('left => centered', animate(100))
    ])
  ]  
})
export class MouseContainerComponent implements OnInit {
  state = 'left';

  translation: 'translateX(-100px)';

 	task: Task;
 	taskSubscription: Subscription;

  constructor(private taskService: TaskService, private incService: TimeIncrementService) { }

  ngOnInit() {
  	this.taskSubscription = this.taskService.mouseContainer
  		.subscribe(
  			([task, taskX, taskY, mouseX, mouseY]: [Task, number, number, number, number]) => {

          let initialWidth;
          let initialHeight;

          if (task.previousDate === null){
            initialWidth = $('.task-window').width()*0.8;
            initialHeight = 130;
          } else initialHeight = ((task.time/15)*32)-6;

  				this.task = task;

          

          // console.log($('.animate-mouse').offset());
          // this.state == 'left' ? this.state = 'centered' : this.state = 'left';

          $('.animate-mouse').css({width: initialWidth, height: initialHeight, left: taskX-mouseX-20, top: -1*(20+mouseY-taskY)});
          $('.animate-mouse').animate({width: '90%', height: ((task.time/15)*32)-6, left: 0, top: 0}, 200);
  			}
  			);
  }

  onMouseUp(){
    if (this.taskService.selectedTask !== null){
      if (this.taskService.selectedTask.previousDate !== null){
        this.incService.moveTask(this.taskService.selectedTask, this.taskService.selectedTask.previousDate);
        if (this.incService.moveSuccessful === true){
          this.taskService.selectedTask.date=this.taskService.selectedTask.previousDate;
          this.taskService.selectedTask.previousDate = new Date(0);
          this.taskService.emitTask(this.taskService.selectedTask);
          this.taskService.selectedTask = null;
        }
      } else if (this.taskService.selectedTask.previousDate === null){
        this.taskService.sendBackToTaskWindow();
      }
          
    }
  }

}
