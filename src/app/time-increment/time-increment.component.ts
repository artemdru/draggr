import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../services/task.service';
import { TimeIncrementService } from '../services/time-increment.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-time-increment',
  templateUrl: './time-increment.component.html',
  styleUrls: ['./time-increment.component.css']
})
export class TimeIncrementComponent implements OnInit, OnDestroy {

	public style: Object = {};
	@Input() date: number;
	isHour = false;
	isHalfHour = false;
	taskSubscription: Subscription;
  incSubscription: Subscription;
	task: Task;
  @ViewChild('timeIncrement') container: ElementRef;
  @ViewChild('myTask') myTask: ElementRef;
  isOccupied: boolean = false;
  occupantID: number;

  constructor(private taskService: TaskService, private incService: TimeIncrementService) { }

  ngOnInit() {

    // Stylize time increment based on its time.
  	if ((this.date/60000)%60 === 45){
  		this.isHour = true;
      // Add an hour divider.
  		this.style = {
        'box-shadow': '0px -1px 0px 0px #bcbec0 inset'
  		}
  	} else if ((this.date/60000)%60 === 30){
      // Add a half-hour divider (in html template).
  		this.isHalfHour = true;
  	}


    // Receive a task, store it in our task variable, render the task,
    // and update our occupation status.
    this.taskSubscription = this.taskService.taskAdded
      .subscribe(
        (task: Task) => {
          if (task.date === this.date){
            this.task = task;
            this.isOccupied = true; 
          }
        }
      );


    // Receive an instruction from moveTask method in TimeIncService
    this.incSubscription = this.incService.dateSubject
      .subscribe(
        // 0 - Checks increment occupation status
        // 1 - for onoccupying increments previously occupied by task being dropped
        // 2 - for occupying new increments
        //                                 Task, code,   timeInc, targetTime
          ([task, code, date, targetDate]: [Task, number, number, number]) => {
            // CODE 0:
            // Check our occupation status.
            if (date === this.date && code === 0){

              // Tell time increment service about my occupation status.
              // Proceed (return false isOccupied status) if task being moved is already my assigned task.
              if (this.occupantID !== undefined && task.id === this.occupantID){
                this.incService.storeOccupationStatus(false);
                return false;

              // Move tasks out of the way if this time increment is occupied.
              } else if (this.isOccupied === true){
                // Get the time increment we need to move to by finding the first
                // date not occupied by the task currently occupying this time inc.
                var targetIncrement = targetDate+(task.time*60000);

                // Move the task to that date.
                var movingTask = this.taskService.tasks[this.taskService.getTaskArrayPos(this.occupantID)];
                this.incService.moveTask(movingTask, targetIncrement);
                movingTask.date= targetIncrement;

                // For some reason, task times of 15 minutes do not get rendered properly when moved.
                // The fix is likely with async loading. This is a temporary fix.
                if (movingTask.time === 15){
                  setTimeout(() => {
                    this.taskService.emitTask(movingTask);
                  }, 1);
                } else this.taskService.emitTask(movingTask);
              }

              // Tell the time increment service of our occupation status.
              this.incService.storeOccupationStatus(this.isOccupied);
              // TODO: This is likely unneccessary. Remove storedOccupation from project.

            // CODE 1:
            // Unoccupy myself, task is leaving me.
            } else if (date === this.date && code === 1){
              this.isOccupied = false;
              this.occupantID = undefined;
              if (this.task && !this.task.name){
                this.task = undefined;
              }

            // CODE 2:
            // New task has arrived, set myself to occupied and assign myself to a task.
            } else if (date === this.date && code === 2){
              this.occupantID = task.id;
              this.isOccupied = true;
            }
          }
        );


      // If there's a task with our date, that means it's ours!
      this.task = this.taskService.getTaskByDate(this.date);


      // Check if time increment is already assigned a task.
      if (this.task !== undefined){
        // Wait for all time increments in date to initiate.
        setTimeout(() => {
          // Render tasks in our time increment.
          this.incService.initTimes(this.task, this.date);
        }, 300);
        this.isOccupied = true;

        // TODO: initTimes asynchronously after all time increments in date have initiated,
        // rather than with a setTimeout method.
      }
  }


  // Triggered when task had been dropped on this time increment.
  onMouseUp(){
    // We're unocuppied, so move task to our date.
    if (!this.isOccupied){
      if (this.taskService.selectedTask !== null){
        this.incService.moveTask(this.taskService.selectedTask, this.date);

        this.taskService.selectedTask.date = this.date;
        this.taskService.selectedTask.previousDate = 0;
        this.taskService.emitTask(this.taskService.selectedTask);
        this.taskService.selectedTask = null;
      }
    // We're occupied, so move task back to its previous location.  
    } else if (this.isOccupied){
      this.incService.moveTaskToPreviousLocation();
    }
  }

  ngOnDestroy(){
    this.taskSubscription.unsubscribe();
    this.incSubscription.unsubscribe();
  }

}
