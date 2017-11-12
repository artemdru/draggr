import { Component, 
  OnInit, 
  Input, 
  ViewChild, 
  ElementRef, 
  Renderer2, 
  AfterViewInit, 
  ChangeDetectorRef, 
  AfterViewChecked } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { TimeIncrementService } from '../time-increment.service';

import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit, AfterViewChecked {

	@Input() task: Task;
	public style: Object = {};
  @ViewChild('taskContainer') taskContainer: ElementRef;

  previousHeight: number;
  containerWidth: number;
  draggerHeight = "60%";
  
  constructor(private incService: TimeIncrementService, private renderer: Renderer2, private cdref: ChangeDetectorRef) {}

  ngOnInit() {
    this.previousHeight = ((this.task.time/15)*32)-6;
  }

  ngAfterViewInit(){
    if (this.task.date === null){
      this.containerWidth = (Math.round(this.taskContainer.nativeElement.offsetWidth/9));

      // this line is to remove ExpressionChangedAfterItHasBeenCheckedError
      this.cdref.detectChanges();
    }

  }

  ngAfterViewChecked(){
    this.containerWidth = (Math.round(this.taskContainer.nativeElement.offsetWidth/9));

    // this line is to remove ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();
  }

  onResizing(event: ResizeEvent): void {
    this.draggerHeight = "0";
    console.log(event.rectangle.height);
    if (event.rectangle.height < this.previousHeight){
      // console.log("taskComponent saw decrease in size");

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
        this.incService.unoccupyLastTime(this.task, this.task.date);
        this.task.time = ((event.rectangle.height+6)/32) * 15;
        this.style = {
          height: `${event.rectangle.height}px`
        }
      }
      
    }

    if (event.rectangle.height > this.previousHeight){
      // console.log("taskComponent saw increase in size");

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
            this.style = {
              height: `${event.rectangle.height}px`
            }
            this.task.time = ((event.rectangle.height+6)/32) * 15;
            this.incService.initTimes(this.task, this.task.date);
      }

    }


    this.previousHeight = event.rectangle.height;
    setTimeout(() => {
      if (this.draggerHeight === "0"){
        this.draggerHeight = "60%";
      }
      
      
    }, 100);
  }

  getHour(number: number){
    if (number>=60){
      return Math.floor(number/60) + 'h';
    }
    
  }

  getMinutes(number: number){
    if (number%60 !== 0){
      return number%60;
    } else return '00';
  }
}
