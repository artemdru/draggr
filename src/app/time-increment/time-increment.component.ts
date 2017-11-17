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

  	if (this.date.getMinutes() === 45){
  		this.isHour = true;
  		this.style = {
        'box-shadow': '0px -1px 0px 0px #bcbec0 inset'
  		}
  	} else if (this.date.getMinutes() === 15){
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
            if (task.date.getTime() === this.date.getTime()){
              this.task = task;
              this.isOccupied = true;
            }
          }
        );

    this.incSubscription = this.incService.dateSubject
      .subscribe(
          ([task, code, date, targetDate]: [Task, number, number, number]) => {
            if (date === this.date.getTime() && code === 0){

              // tell time increment service about my occupation status
              // proceed (return false isOccupied status) if task being moved is already my assigned task
              if (this.occupantID !== undefined && task.id === this.occupantID){
                this.incService.storeOccupationStatus(false);
                return false;
              } else if (this.isOccupied === true){
                var targetIncrement = new Date(targetDate+(task.time*60000));
                var previousOccupantID = this.occupantID;

                this.incService.moveTask(this.taskService.tasks[previousOccupantID], targetIncrement);
                if (this.incService.moveSuccessful === true){
                  this.taskService.tasks[previousOccupantID].date= targetIncrement;
                  console.log(this.taskService.tasks[previousOccupantID]);
                  this.taskService.emitTask(this.taskService.tasks[previousOccupantID]);
                }
              }
              this.incService.storeOccupationStatus(this.isOccupied);

            } else if (date === this.date.getTime() && code === 1){

              // unoccupy myself, task is leaving me
              this.isOccupied = false;
              this.occupantID = undefined;

            } else if (date === this.date.getTime() && code === 2){

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
    if (this.taskService.selectedTask !== null){
          this.incService.moveTask(this.taskService.selectedTask, this.date);
        if (this.incService.moveSuccessful === true){
        this.taskService.selectedTask.date=this.date;
        this.taskService.emitTask(this.taskService.selectedTask);
        this.taskService.selectedTask = null;
      }
    }

  }

  onClick(){
    console.log(this.task, this.occupantID, this.isOccupied);
  }

  ngOnDestroy(){
    this.taskSubscription.unsubscribe();
    this.incSubscription.unsubscribe();
  }

}
