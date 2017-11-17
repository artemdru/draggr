import { Component, 
  OnInit, 
  Input, 
  ViewChild, 
  ElementRef, 
  Renderer2, 
  AfterViewInit, 
  ChangeDetectorRef} from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

import * as $ from 'jquery';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { TimeIncrementService } from '../time-increment.service';

import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit {

	@Input() task: Task;
	public style: Object = {};
  @ViewChild('taskContainer') taskContainer: ElementRef;
  @ViewChild('taskName') taskNameElRef: ElementRef;
  @ViewChild('timeContainer') timeContainerElRef: ElementRef;
  @ViewChild('colorSelector') colorSelectorElRef: ElementRef;
  @ViewChild('deleteButton') deleteButtonElRef: ElementRef;

  taskEl: any;
  taskNameEl: any;
  timeContainerEl: any;
  colorSelectorEl: any;
  deleteButtonEl: any;

  previousHeight: number;
  containerWidth: number;
  draggerHeight = "60%";

  offset: string = '89px';

  taskRefresher: Subscription;

  constructor(private taskService: TaskService, private incService: TimeIncrementService, private renderer: Renderer2, private cdref: ChangeDetectorRef) {}

  ngOnInit() {
    this.previousHeight = ((this.task.time/15)*32)-6;


    // this.taskRefresher = this.taskService.taskRefresher
    //   .subscribe(
    //       () => {
            
    //         this.containerWidth = (Math.round(this.taskContainer.nativeElement.offsetWidth/9));
    //         console.log(this.containerWidth);
    //         this.cdref.detectChanges();
    //       }
    //     );
  }

  ngAfterViewInit(){

    this.taskEl = this.taskContainer.nativeElement;
    this.taskNameEl = this.taskNameElRef.nativeElement;
    this.timeContainerEl = this.timeContainerElRef.nativeElement;
    this.colorSelectorEl = this.colorSelectorElRef.nativeElement;
    this.deleteButtonEl = this.deleteButtonElRef.nativeElement;

    if (this.task.date === null){
      this.containerWidth = (Math.round(this.taskEl.offsetWidth/9));
    } else this.stylizeTaskContainer(this.task.time);

      // this line is to remove ExpressionChangedAfterItHasBeenCheckedError
      this.cdref.detectChanges();
  }

  onResizing(event: ResizeEvent): void {
    this.draggerHeight = "0";
    console.log(this.previousHeight, this.task.name);
    if (event.rectangle.height < this.previousHeight){
      // console.log("taskComponent saw decrease in size");

      let freedBlocks = (this.previousHeight - event.rectangle.height)/32

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date, this.task.date);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
        console.log("freed blocks " + freedBlocks);
          this.incService.unoccupyLastTime(this.task, this.task.date, freedBlocks);
        
        this.task.time = ((event.rectangle.height+6)/32) * 15;
        this.style = {
          height: `${event.rectangle.height}px`
        }
      }
      
    }

    if (event.rectangle.height > this.previousHeight){
      // console.log("taskComponent saw increase in size");

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date, this.task.previousDate);
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

    this.stylizeTaskContainer(this.task.time);
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

  stylizeTaskContainer(time: number){
    if(time === 15){
      this.containerWidth = 26;
      this.taskNameEl.style.fontSize = '15px';
      this.colorSelectorEl.style.left = '32px';
      this.deleteButtonEl.style.right = '4px';
      this.timeContainerEl.style.right = '32px';
      this.timeContainerEl.style.top = '4px';
      this.taskNameEl.style.width = '100%';
    } else if (time === 30){
      this.containerWidth = 35;
      this.taskNameEl.style.fontSize = '20px'; 
      this.colorSelectorEl.style.left = '4px';
      this.deleteButtonEl.style.right = '4px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '70%';
    } else if (time === 45){
      this.containerWidth = 35;
      this.taskNameEl.style.fontSize = '23px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '80%';

    } else if (time === 60){
      this.containerWidth = 40;
      this.taskNameEl.style.fontSize = '26px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '100%';
    } else if (time > 60){
      this.containerWidth = time;
      this.taskNameEl.style.fontSize = '26px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '100%';
    }
  }

  onMouseDown(event){
    this.taskService.addToMouseContainer(this.task.id);
    this.incService.moveTask(this.taskService.selectedTask, new Date(0));
  }
}
