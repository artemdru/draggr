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

import { TimeIncrementService } from '../services/time-increment.service';

import { TaskService } from '../services/task.service';
import { TutorialService } from '../services/tutorial.service';
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
  completeButtonEl: any;

  previousHeight: number;
  containerWidth: number;
  draggerHeight = "80%";

  offset: string = '89px';

  completeClickable: boolean = true;
  initSinceCompleted: boolean = false;
  completeThisTask: boolean = false;

  recordedRect: any;

  tutorialProgress: number;

  taskRefresher: Subscription;
  tutorialSubscription: Subscription;

  constructor(private taskService: TaskService, 
    private incService: TimeIncrementService, 
    private renderer: Renderer2,
    private tutorialService: TutorialService, 
    private cdref: ChangeDetectorRef) {}

  ngOnInit() {

    this.previousHeight = ((this.task.time/15)*32)-6;

    if (this.tutorialService.tutorialProgress !== 0 && this.tutorialService.tutorialTaskID === this.task.id){
      this.tutorialSubscription = this.tutorialService.tutorialCompleted
        .subscribe(
          (progress: number) => {
            if (this.task.id == this.tutorialService.tutorialTaskID){
              this.tutorialProgress = progress;
            } else this.tutorialProgress = 0;
          }
        );
    }
    this.tutorialProgress = this.tutorialService.tutorialProgress;

    console.log("tutorial progress: " + this.tutorialProgress, this.tutorialSubscription);

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


    if (this.task.isComplete){
      this.initSinceCompleted = true;
    }

    this.taskEl = this.taskContainer.nativeElement;
    this.taskNameEl = this.taskNameElRef.nativeElement;
    this.timeContainerEl = this.timeContainerElRef.nativeElement;
    this.colorSelectorEl = this.colorSelectorElRef.nativeElement;
    this.deleteButtonEl = this.deleteButtonElRef.nativeElement;


    if (this.task.date === 1){
      this.containerWidth = (Math.round(this.taskEl.offsetWidth/9));
    } else this.stylizeTaskContainer(this.task.time);

    // this line is to remove ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();


    if (this.task.date !== 1 && this.task.previousDate !== 1 && this.task.previousDate === 0){

      let mouseCoords = $('.animate-mouse').offset();
      const rect = this.taskEl.getBoundingClientRect();

      $(this.taskEl).css({left: mouseCoords.left-rect.left, top: mouseCoords.top-rect.top+33});
      $(this.taskEl).animate({left: 0, top: 3}, 200, () => {this.task.previousDate = this.task.date});
      
    } else if (this.task.previousDate !== 1 && this.task.date != 0 && this.task.date != this.task.previousDate){
      $(this.taskEl).css({top: -10});
      $(this.taskEl).animate({top: 3}, 100, () => {this.task.previousDate = this.task.date});
    }

    if (this.task.date > 1){
      this.incService.initTimes(this.task, this.task.date);
    }    
    
  }

  onResizing(event: ResizeEvent): void {
    this.draggerHeight = "0";
    if (event.rectangle.height < this.previousHeight){
      // console.log("taskComponent saw decrease in size");

      let freedBlocks = (this.previousHeight - event.rectangle.height)/32

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date, this.task.date, this.task.isComplete);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
        console.log("freed blocks " + freedBlocks);
          this.incService.unoccupyLastTime(this.task, this.task.date, freedBlocks);
        
        this.task.time = ((event.rectangle.height+6)/32) * 15;

        // $(this.taskEl).stop();
        // $(this.taskEl).animate({height: `${event.rectangle.height}px`}, 100);
        this.style = {
          height: `${event.rectangle.height}px`
        }
      }
      
    }

    if (event.rectangle.height > this.previousHeight){
      // console.log("taskComponent saw increase in size");

      let proposedTask: Task = new Task(this.task.id, this.task.name, ((event.rectangle.height+6)/32) * 15, this.task.date, this.task.previousDate, this.task.isComplete);
      this.incService.moveTask(proposedTask, proposedTask.date);
      if (this.incService.moveSuccessful){
            // $(this.taskEl).stop();
            // $(this.taskEl).animate({height: `${event.rectangle.height}px`}, 100);
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
        this.draggerHeight = "80%";
      }
      
      
    }, 100);

    this.stylizeTaskContainer(this.task.time);

    this.tutorialService.completeTutorial(3);
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
    const rect = this.taskEl.getBoundingClientRect();
    this.taskService.selectTask(this.task.id);
    this.incService.moveTask(this.taskService.selectedTask, 0);


    // * DEPRECATED * left here in case it's needed
    // this logic fixes bug where dragging a completed task before it has triggered ngAfterViewInit causes
    // the rect to have coords of 0,0 - thus, being dragged in to mouse container from top left
    // if (this.task.isComplete && !this.initSinceCompleted){
    //   this.taskService.addToMouseContainer(this.task.id, this.recordedRect.left, this.recordedRect.top, event.pageX, event.pageY);
    //   this.initSinceCompleted = true;
    // }

    this.taskService.addToMouseContainer(this.task.id, rect.left, rect.top, event.pageX, event.pageY);
    
  }

  onComplete(){
      this.recordedRect = this.taskEl.getBoundingClientRect();
      this.task.isComplete = !this.task.isComplete;

        // Quickly send to mouse container and back to trigger AfterViewInit
        // Properly styles task when (un)completed
        this.taskService.selectTask(this.task.id);
        this.incService.moveTask(this.taskService.selectedTask, 0);        
        this.taskService.addToMouseContainer(this.task.id, this.recordedRect.left, this.recordedRect.top, this.recordedRect.left, this.recordedRect.top);

        setTimeout(() => {
          if (this.taskService.selectedTask !== null){
          this.incService.moveTask(this.taskService.selectedTask, this.task.previousDate);
            if (this.incService.moveSuccessful === true){
              this.taskService.selectedTask.date=this.task.previousDate;
              this.taskService.emitTask(this.taskService.selectedTask);
              this.taskService.selectedTask = null;
            }
          }
        }, 1);        
        
      this.tutorialService.completeTutorial(4);
  }

  onDelete(){
      this.taskService.deleteTask(this.task.id);

      if (this.task.date !== 1){
      this.incService.unoccupyLastTime(this.task, this.task.date, this.task.time/15);
      }
  }
}
