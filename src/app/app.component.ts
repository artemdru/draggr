import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import { detect } from 'detect-browser';

import { DateService } from './date.service';

import { TaskService } from './task.service';
import { TimeIncrementService } from './time-increment.service';
import { AuthService } from './auth/auth.service';

import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { GreetingDialogComponent } from './greeting-dialog/greeting-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('vertScroll') vertScroll: ElementRef;

  title = 'app';

  dates: Date[];

  dateWidth: number;

  isScrollable = true;

  browserName: string;
  public scrollbarOptions = {};

  constructor(private dateService: DateService, 
    private taskService: TaskService, 
    private incService: TimeIncrementService,
    private mScrollbarService: MalihuScrollbarService,
    private authService: AuthService,
    public dialog: MatDialog){}

  ngOnInit() {
    this.dates = this.dateService.dates;

    firebase.initializeApp({
      apiKey: "AIzaSyCQC_Iu0az3PaK9mmDETp3IN6eQa0vDiFM",
      authDomain: "draggr-73506.firebaseapp.com",
      databaseURL: "https://draggr-73506.firebaseio.com"
    });

    // setTimeout(() => {
      this.authService.checkIfLoggedIn()
        .then((code: number) => {
          if (code === 0) {
            console.log("Logged in!");
          } else if (code === 1){
            let dialogRef = this.dialog.open(GreetingDialogComponent, {
            width: '750px',
            height: '500px'
          });

            dialogRef.afterClosed()
              .subscribe(
                () => { this.taskService.isDialogOpen = false; }
              );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    // }, 300);
    

    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }

    if (this.browserName === 'firefox'){
      this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 300 };
    } else this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 75, mouseWheel:{ scrollAmount: 50 } };

    console.log(this.browserName);

    
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

    // Hide the scrollbar on calendar
    $('#mCSB_1_scrollbar_vertical').css("right", "-20px");

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

    // scroll to the present hour
    this.mScrollbarService.scrollTo(this.vertScroll.nativeElement, (new Date().getHours()-1)*128, this.scrollbarOptions);
    $('.vert-scroll').scrollTop((new Date().getHours()-1)*128);

    
    
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
      if (this.taskService.selectedTask.previousDate !== 1){
        this.incService.moveTask(this.taskService.selectedTask, this.taskService.selectedTask.previousDate);
        if (this.incService.moveSuccessful === true){
          this.taskService.selectedTask.date=this.taskService.selectedTask.previousDate;
          this.taskService.selectedTask.previousDate = 0;
          this.taskService.emitTask(this.taskService.selectedTask);
          this.taskService.selectedTask = null;
        }
      } else if (this.taskService.selectedTask.previousDate === 1){
        this.taskService.sendBackToTaskWindow();
      }
          
    }
  }

}
