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

  	if ((this.date/60000)%60 === 45){
  		this.isHour = true;
  		this.style = {
        'box-shadow': '0px -1px 0px 0px #bcbec0 inset'
  		}
  	} else if ((this.date/60000)%60 === 30){
  		this.isHalfHour = true;
      this.style = {
        // 'z-index': '-1',
        // 'opacity': '0.5',
        // 'box-shadow': '0px -0.5px 0px 0px #e5e5e5 inset'
      }
  	}

    this.taskSubscription = this.taskService.taskAdded
      .subscribe(
        (task: Task) => {
          if (task.date === this.date){
            this.task = task;
            this.isOccupied = true; 
          }
        }
      );

    this.incSubscription = this.incService.dateSubject
      .subscribe(
          ([task, code, date, targetDate]: [Task, number, number, number]) => {
            if (date === this.date && code === 0){

              // tell time increment service about my occupation status
              // proceed (return false isOccupied status) if task being moved is already my assigned task
              if (this.occupantID !== undefined && task.id === this.occupantID){
                this.incService.storeOccupationStatus(false);
                return false;
              } else if (this.isOccupied === true){
                var targetIncrement = targetDate+(task.time*60000);
                var previousOccupantID = this.occupantID;

                var movingTask = this.taskService.tasks[this.taskService.getTaskArrayPos(previousOccupantID)];


                //TODO: implement a better way to asyncronously emit task. Simply making the moveTask
                // method return a promise is not enough, maybe try breaking up the entire moveTask
                // method into multiple promises and .then() calls within itself

                this.incService.moveTask(movingTask, targetIncrement);
                movingTask.date= targetIncrement;
                
                if (movingTask.time === 15){
                  
                  setTimeout(() => {
                    this.taskService.emitTask(movingTask);
                  }, 1);
                } else 

                this.taskService.emitTask(movingTask);
              }
              this.incService.storeOccupationStatus(this.isOccupied);

            } else if (date === this.date

             && code === 1){

              // unoccupy myself, task is leaving me
              this.isOccupied = false;
              this.occupantID = undefined;
              if (this.task && !this.task.name){
                this.task = undefined;
              }

            } else if (date === this.date && code === 2){

              // new task has arrived, set myself to occupied and assign myself to a task
              this.occupantID = task.id;
              this.isOccupied = true;


             
            }
          }
        );

      this.task = this.taskService.getTaskByDate(this.date);


      // check if time increment is already assigned a task

      if (this.task !== undefined){

        // wait for all time increments in date to init
        setTimeout(() => {                    // TODO: find a more elegant way, rather than arbitrary wait time
          this.incService.initTimes(this.task, this.date);
        }, 300);
        this.isOccupied = true;
      }
  }

  onMouseUp(){
    if (!this.isOccupied){
      if (this.taskService.selectedTask !== null){
        this.incService.moveTask(this.taskService.selectedTask, this.date);

        this.taskService.selectedTask.date=this.date;
        this.taskService.selectedTask.previousDate = 0;
        this.taskService.emitTask(this.taskService.selectedTask);
        this.taskService.selectedTask = null;
      }
    } else if (this.isOccupied){
      this.incService.moveTaskToPreviousLocation();
    }
  }

  ngOnDestroy(){
    this.taskSubscription.unsubscribe();
    this.incSubscription.unsubscribe();
  }

}
