import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

import { DateService } from './date.service';

import { TaskService } from './task.service';
import { TimeIncrementService } from './time-increment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  dates: Date[];

  dateWidth: number;

  isScrollable = true;

  constructor(private dateService: DateService, private taskService: TaskService, private incService: TimeIncrementService){}

  ngOnInit() {
    this.dates = this.dateService.dates;
  }

  ngAfterViewInit() {
    this.dateWidth = $('#date').width();
    $('.days-otw, .calendar').scrollLeft(this.dateWidth+1);

    // $('.vert-scroll').on('scroll touchmove mousewheel', function(e){
    //   console.log("this thing scrolled");
    //   e.preventDefault();
    //   e.stopPropagation();
    //   return false;
    // })
    (<any>$('body')).mousedown((e) => {
      $('app-mouse-container').css("z-index", "20");
      $('app-mouse-container').offset({ left: e.pageX+20, top: e.pageY+20 });
      (<any>$('body')).mousemove((e) => {
        if (!this.taskService.isDialogOpen){document.getSelection().removeAllRanges();}
        
        var offsetX = e.pageX;
        var offsetY = e.pageY;
        $('app-mouse-container').offset({ left: offsetX+20, top: offsetY+20 });
      }).mouseup((e) => {
        $('body').unbind('mousemove');
        $('app-mouse-container').css("z-index", "-20");
      });
    });
  }

  onResize(){
    this.dateWidth = $('#date').width();
    $('.days-otw, .calendar').scrollLeft(this.dateWidth+1);
  }

  backDay(){
    if (this.isScrollable){
      this.dateService.addDay('back');
      $('.days-otw, .calendar').scrollLeft(this.dateWidth*2);
      $('.days-otw, .calendar').animate({scrollLeft: this.dateWidth+1}, 350);
      this.isScrollable = false;
      setTimeout(() => {
        this.isScrollable = true;
      }, 355);
    }
    
  }

  fwdDay(){
    if (this.isScrollable){
      this.dateService.addDay('fwd');
    $('.days-otw, .calendar').scrollLeft(1);
    $('.days-otw, .calendar').animate({scrollLeft: '+=' + this.dateWidth}, 350);
    this.isScrollable = false;
      setTimeout(() => {
        this.isScrollable = true;
      }, 355);
    }
    
  }

  keepScroll(){
    $('.vert-scroll').scrollLeft(0);
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
