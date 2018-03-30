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
  @ViewChild('taskNameContainer') taskNameContainer: ElementRef;
  @ViewChild('taskEditorContainer') taskEditorContainer: ElementRef;
  @ViewChild('taskEditorInput') taskEditorInput: ElementRef;

  taskEl: any;
  taskNameEl: any;
  timeContainerEl: any;
  colorSelectorEl: any;
  deleteButtonEl: any;
  completeButtonEl: any;
  taskNameContainerEl: any;
  taskEditorContainerEl: any;
  taskEditorInputEl: any;

  previousHeight: number;
  containerWidth: number;
  draggerHeight = "80%";

  offset: string = '89px';

  recordedRect: any;

  completedBackgroundColor: string;

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


    // Subscribe to tutorial only if tutorial is activated (first user login or demo).
    if (this.tutorialService.tutorialProgress !== 0 && this.tutorialService.tutorialTaskID === this.task.id){
      this.tutorialSubscription = this.tutorialService.tutorialCompleted
        .subscribe(
          (progress: number) => {
            // Only render tutorial of this task is the one currently being practiced with.
            if (this.task.id == this.tutorialService.tutorialTaskID){
              this.tutorialProgress = progress;
            } else this.tutorialProgress = 0;
          }
        );
    }

    // Get the tutorial progress if task has been created and tutorial does not need to progress.
    if (this.task.id == this.tutorialService.tutorialTaskID){this.tutorialProgress = this.tutorialService.tutorialProgress;}
    
  }

  ngAfterViewInit(){
    // Store references to elementref's nativeElement for shorter code.
    this.taskEl = this.taskContainer.nativeElement;
    this.taskNameEl = this.taskNameElRef.nativeElement;
    this.timeContainerEl = this.timeContainerElRef.nativeElement;
    this.colorSelectorEl = this.colorSelectorElRef.nativeElement;
    this.deleteButtonEl = this.deleteButtonElRef.nativeElement;
    this.taskNameContainerEl = this.taskNameContainer.nativeElement;
    this.taskEditorContainerEl = this.taskEditorContainer.nativeElement;
    this.taskEditorInputEl = this.taskEditorInput.nativeElement;


    // Tasks in task window (.date == 1) and tasks on time increments have different
    // styling, so stylize each task when its view is initiated.
    if (this.task.date === 1){
      this.containerWidth = (Math.round(this.taskEl.offsetWidth/9));
    } else this.stylizeTaskContainer(this.task.time);


    // Smoothly move task from mouse container to time increment.
    if (this.task.date !== 1 && this.task.previousDate === 0){
      let mouseCoords = $('.animate-mouse').offset();
      const rect = this.taskEl.getBoundingClientRect();

      $(this.taskEl).css({left: mouseCoords.left-rect.left, top: mouseCoords.top-rect.top+33});
      $(this.taskEl).animate({left: 0, top: 3}, 200, () => {this.task.previousDate = this.task.date});

    // Smoothly move task from previous time increment to next one when being moved by
    // another task's overflow occupying its current time increment.   
    } else if (this.task.previousDate !== 1 && this.task.date !== 0 && this.task.date !== this.task.previousDate){
      $(this.taskEl).css({top: -10});
      $(this.taskEl).animate({top: 3}, 100, () => {this.task.previousDate = this.task.date});
    }


    // Render tasks and set occupation status of their time increments.
    if (this.task.date > 1){
      this.incService.initTimes(this.task, this.task.date);
    }    
    

    // Removes error ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();
  }


  // Fired on every resize of the task.
  onResizing(event: ResizeEvent): void {
    // Hide the dragger so we don't accidentally drag as we resize.
    this.draggerHeight = "0";


    // Decrease in size.
    if (event.rectangle.height < this.previousHeight){
      // Count how many time increments (blocks) we have freed, since 
      // multiple resizes may happen in one resizing event if user resizes quickly.
      let freedBlocks = (this.previousHeight - event.rectangle.height)/32

      // Unoccupy time increments that we will no longer occupy after resizing.
      this.incService.unoccupyLastTime(this.task, this.task.date, freedBlocks); 

      // Adjust task's height.
      this.style = {
        height: `${event.rectangle.height}px`
      }
      this.task.time = ((event.rectangle.height+6)/32) * 15;
      
      // Write tasks to database. Since we are not changing this task through 
      // TimeIncServices' moveTask(), call this method here.
      setTimeout(() => {
        this.taskService.updateTasks();
      }, 500);
    }


    // Increase in size
    if (event.rectangle.height > this.previousHeight){

      // Generate an object that resembles what the resized task would be.
      let proposedTask: Task = new Task(this.task.id, 
                                        this.task.name, 
                                        ((event.rectangle.height+6)/32) * 15, 
                                        this.task.date, 
                                        this.task.previousDate,
                                        this.task.color, 
                                        this.task.isComplete);

      // "Moving" the task with this method will move other tasks out of the way.
      this.incService.moveTask(proposedTask, proposedTask.date);

      // Adjust task's height.
      this.style = {
        height: `${event.rectangle.height}px`
      }
      this.task.time = ((event.rectangle.height+6)/32) * 15;

      // Update occupation statuses of newly occupied time increments.
      this.incService.initTimes(this.task, this.task.date);
    }

    // Store previous height to determine if task is being increased or decreased
    // in size, as well as to calculate how many time increments have been freed
    // when decrease in size.
    this.previousHeight = event.rectangle.height;

    // Reinitiate the dragger 100 miliseconds after we're done resizing.
    setTimeout(() => {
      if (this.draggerHeight === "0"){
        this.draggerHeight = "80%";
      }
    }, 100);

    // Stylize the task according to its new height.
    this.stylizeTaskContainer(this.task.time);

    this.tutorialService.completeTutorial(3);
  }


  // Returns an integer of how many hours in the task time.
  getHour(number: number){
    if (number>=60){
      return Math.floor(number/60) + 'h';
    } 
  }


  // Returns an integer of minutes remaining after abstracting time to hours.
  getMinutes(number: number){
    if (number%60 !== 0){
      return number%60;
    } else return '00';
  }


  // Styles the task's name fontsize, button and name positions according to
  // its size, based on its time. Only done for tasks in the calendar or
  // mouse-container.
  stylizeTaskContainer(time: number){
    if(time === 15){
      this.containerWidth = 26;
      this.taskEditorInputEl.style.fontSize = '15px';
      this.taskNameEl.style.fontSize = '15px';
      this.colorSelectorEl.style.left = '32px';
      this.deleteButtonEl.style.right = '4px';
      this.timeContainerEl.style.right = '32px';
      this.timeContainerEl.style.top = '4px';
      this.taskNameEl.style.width = '100%';
    } else if (time === 30){
      this.containerWidth = 35;
      this.taskEditorInputEl.style.fontSize = '20px';
      this.taskNameEl.style.fontSize = '20px'; 
      this.colorSelectorEl.style.left = '4px';
      this.deleteButtonEl.style.right = '4px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '70%';
    } else if (time === 45){
      this.containerWidth = 35;
      this.taskEditorInputEl.style.fontSize = '23px';
      this.taskNameEl.style.fontSize = '23px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '80%';
    } else if (time === 60){
      this.containerWidth = 40;
      this.taskEditorInputEl.style.fontSize = '26px';
      this.taskNameEl.style.fontSize = '26px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '100%';
    } else if (time > 60){
      this.containerWidth = time;
      this.taskEditorInputEl.style.fontSize = '26px';
      this.taskNameEl.style.fontSize = '26px'; 
      this.colorSelectorEl.style.left = '14px';
      this.deleteButtonEl.style.right = '10px';
      this.timeContainerEl.style.right = '18px';
      this.timeContainerEl.style.top = '5px';
      this.taskNameEl.style.width = '100%';
    }
  }


  // Start "dragging" the task by adding it to mouse-container.
  onMouseDown(event){
    const rect = this.taskEl.getBoundingClientRect();
    this.taskService.selectTask(this.task.id);
    this.incService.moveTask(this.taskService.selectedTask, 0);
    this.taskService.addToMouseContainer(this.task.id, rect.left, rect.top, event.pageX, event.pageY);    
  }


  // Completes the task, when complete button is pressed.
  onComplete(){
    // Store current 
    this.task.isComplete = !this.task.isComplete;

    // Quickly unrender from time increment and render to trigger AfterViewInit.
    // Properly styles task when (un)completed and gives it proper coordinates,
    // but a temporary hack.
    this.taskService.selectTask(this.task.id);
    this.incService.moveTask(this.taskService.selectedTask, 0); 

    setTimeout(() => {
      if (this.taskService.selectedTask !== null){
      this.incService.moveTask(this.taskService.selectedTask, this.task.previousDate);
      this.taskService.selectedTask.date=this.task.previousDate;
      this.taskService.emitTask(this.taskService.selectedTask);
      this.taskService.selectedTask = null;
      }
    }, 1);        
      
    this.tutorialService.completeTutorial(4);
  }/* TODO: Create a smooth animation to complete state. */

  // Change color
  changeColor(){
    if (this.task.color == '#00A651'){
      this.task.color = '#dbd234';
    } else if (this.task.color == "#dbd234"){
      this.task.color = '#763287';
    } else this.task.color = '#00A651';

    //TODO: Implement background completed color (style binding rgba doesn't seem to work)
    this.completedBackgroundColor = this.hexToRgb(this.task.color) + ", 0.3";

    console.log("color changed to " + this.task.color);
    console.log("backgroundColor is " + this.completedBackgroundColor);
    this.taskService.updateTasks();
  }

  // Get RGB values from a Hex color value
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        (parseInt(result[1], 16).toString() + ", " + parseInt(result[2], 16).toString() + ", " + parseInt(result[3], 16).toString())
     : null;
  }

  // Edit task name
  editTask(){
    console.log("Editing a task!");

    this.taskNameContainerEl.style.display='none';
    this.taskEditorContainerEl.style.display='flex';

    this.taskEditorInputEl.setSelectionRange(0,0);
    this.taskEditorInputEl.focus();

    this.draggerHeight = "0";
  }

  closeTaskEditor(){
    console.log("closed task editor!");
    this.task.name = this.taskEditorInputEl.value;
    this.taskService.updateTasks();
    
    this.taskNameContainerEl.style.display='flex';
    this.taskEditorContainerEl.style.display='none';
    this.draggerHeight = "80%";
  }

  // Delete task and unoccupy its times.
  onDelete(){
    this.taskService.deleteTask(this.task.id);
    if (this.task.date !== 1){
      this.incService.unoccupyLastTime(this.task, this.task.date, this.task.time/15);
    }
  }
}
