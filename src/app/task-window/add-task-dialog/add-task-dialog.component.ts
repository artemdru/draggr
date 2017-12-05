import { Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as $ from 'jquery';
import { detect } from 'detect-browser';

import { Task } from '../../task.model';
import { TaskService } from '../../task.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit, AfterViewInit {

	@ViewChild('taskName') taskName: ElementRef;

  constructor(private taskService: TaskService, private authService: AuthService, public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  	times: number[] = [];
  	timewidth: number = 108.88;
  	selectorPos: number = 0;
    browserName: string;

  ngOnInit(){
  	var time: number = 15;
  	for(var _i = 0; _i<24; _i++){
  		this.times[_i] = time;
  		time += 15;
  	}

    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }
  }

  ngAfterViewInit(){

    this.taskService.isDialogOpen = true;

  	$('.time-selector').scrollLeft(109*3);
  	this.selectorPos = 109*3;

  	(<any>$('body')).on('mousewheel DOMMouseScroll', (event) => {
  		if (event.originalEvent.deltaY < 0 || event.detail<0) {
  			            if (this.selectorPos < 2507){
            	this.selectorPos+=109;
            	$('.time-selector').animate({scrollLeft: this.selectorPos}, 50);
            }
            

            
            
        }
        else if (event.originalEvent.deltaY > 0 || event.detail>0){
        	            if (this.selectorPos > 0){
            this.selectorPos-=109;
            $('.time-selector').animate({scrollLeft:  this.selectorPos}, 50);
            }
            

        }
  	});

  	var clickable = true;
  	(<any>$('body')).on('keydown', (e) => {
  		if (e.repeat != undefined){
  			return false;
  		}

  		if (e.keyCode === 13 && clickable === true){
  			$('.clicked').css("opacity", '0');
  			clickable = false;
  			this.addTask();
  			$('.clicked').animate({ opacity: 1}, 500, function(){
  				clickable = true;
  			});
  		} else if (e.keyCode === 39 && clickable === true){
            if (this.selectorPos < 2507){
            	this.selectorPos+=109;
	            $('.time-selector').animate({scrollLeft: this.selectorPos}, 50, function(){
            });
            }

  		} else if (e.keyCode === 37 && clickable === true){
            if (this.selectorPos > 0){
            	this.selectorPos-=109;
    	            $('.time-selector').animate({scrollLeft: this.selectorPos}, 50, function(){
	            });
            }
        } else if (e.keyCode === 27){
          this.taskService.isDialogOpen = false;
        	$('.cancel-button').css("background-color", "silver");
        	$('.cancel-button').animate({ opacity: 1}, 500);
        }
  	});
  }

  getHour(number: number){
  	return Math.floor(number/60);
  }

  getMinutes(number: number){
  	if (number%60 !== 0){
  		return number%60;
  	} else return '00';
  }

  addTask(){

  	if (this.taskName.nativeElement.value !== ''){

      var newTask = new Task(
        this.taskService.getNewTaskID(),
        this.taskName.nativeElement.value,
        (this.selectorPos+109)/109*15,
        new Date(1),
        new Date(1),
        false
        );

      console.log(newTask);

      this.taskService.addTask(newTask);
      this.authService.updateTasks();
  	}

    $('input').animate({opacity: 0}, 150, function(){
  	  $('input').val('');
      $('input').css("opacity", 1);
    });
    $('.time-selector').animate({scrollLeft: (109*3)}, 50);
    this.selectorPos = 109*3;
  }

  closeDialog(){
  	this.dialogRef.close();

    this.taskService.isDialogOpen = false;
  }
}
