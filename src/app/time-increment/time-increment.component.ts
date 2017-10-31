import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { TimeIncrementService } from '../time-increment.service';

@Component({
  selector: 'app-time-increment',
  templateUrl: './time-increment.component.html',
  styleUrls: ['./time-increment.component.css']
})
export class TimeIncrementComponent implements OnInit, OnDestroy {

	public style: Object = {};
	@Input() date: Date;
	isHour = false;
	isHalfHour = false;
	taskSubscription: Subscription;
  incSubscription: Subscription;
	task: Task;
  @ViewChild('timeIncrement') container: ElementRef;
  isOccupied: boolean = false;
  occupantID: number;

  constructor(private taskService: TaskService, private incService: TimeIncrementService) { }

  ngOnInit() {

  	if (this.date.getMinutes() === 0){
  		this.isHour = true;
  		this.style = {
  			'border-top': 'solid silver 1px'
  		}
  	} else if (this.date.getMinutes() === 30){
  		this.isHalfHour = true;
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
          ([task, code, date]: [Task, number, number]) => {
            if (date === this.date.getTime() && code === 0){

              // tell time increment service about my occupation status
              // proceed (return false isOccupied status) if task being moved is already my assigned task
              if (this.occupantID !== undefined && task.id === this.occupantID){
                this.incService.storeOccupationStatus(false);
              } else this.incService.storeOccupationStatus(this.isOccupied);
              

            } else if (date === this.date.getTime() && code === 1){

              // unoccupy myself, task is leaving me
              this.isOccupied = false;
              this.occupantID = undefined;

            } else if (date === this.date.getTime() && code === 2){
              console.log("component time: " + date);

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


  ngOnDestroy(){
    this.taskSubscription.unsubscribe();
    this.incSubscription.unsubscribe();
  }

}
