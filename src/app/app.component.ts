import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as $ from 'jquery';
import * as firebase from 'firebase';
import { detect } from 'detect-browser';

import { DateService } from './services/date.service';

import { TaskService } from './services/task.service';
import { TimeIncrementService } from './services/time-increment.service';
import { AuthService } from './services/auth.service';
import { TutorialService } from './services/tutorial.service';

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

  unchecker: boolean = false;
  browserName: string;

  public scrollbarOptions = {};

  constructor(private dateService: DateService, 
    private taskService: TaskService,
    private incService: TimeIncrementService,
    private mScrollbarService: MalihuScrollbarService,
    private authService: AuthService,
    private tutorialService: TutorialService,
    public dialog: MatDialog){}

  ngOnInit() {
    // If today is n, get the following dates:
    // n-2, n-1, n, n+1, n+2
    // Stored as javascript Date objects.
    this.dates = this.dateService.dates;


    // Connect to firebase
    firebase.initializeApp({
      apiKey: "AIzaSyCQC_Iu0az3PaK9mmDETp3IN6eQa0vDiFM",
      authDomain: "draggr-73506.firebaseapp.com",
      databaseURL: "https://draggr-73506.firebaseio.com"
    });


    // Check if user is logged in.
    // If not logged in (code 1), open greeting-dialog and initiate tutorial
    this.authService.checkIfLoggedIn()
      .then((code: number) => {
        if (code === 1){
          this.tutorialService.startTutorial();
          let dialogRef = this.dialog.open(GreetingDialogComponent, {
          width: '750px',
          height: '500px'
        });

          // User is not allowed to highlight/select elements when dialogs are closed.
          // To prevent from dragging elements while dragging a task.
          dialogRef.afterClosed()
            .subscribe(
              () => { this.taskService.isDialogOpen = false; }
            );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    

    // Detect user browser, which will determine which calendar to render.
    // This also determines whether or not we use MalihuScrollbar, and it's options.
    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
    }

    if (this.browserName === 'firefox'){
      this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 300 };
    } else this.scrollbarOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 75, mouseWheel:{ scrollAmount: 50 } };

    console.log("Opened on browser: " + this.browserName);

    
  }

  ngAfterViewInit() {

    // The calendar initiates with 5 days. If today is n, the calendar is:
    // n-2, n-1, n, n+1, n+2
    // After calendar renders, this sets the horizontal scroll to be precisely on day n-1
    this.dateWidth = $('#date').width();
    $('.days-otw, .calendar').scrollLeft(this.dateWidth+1);

    
    // Move the mouse-container, which is a component rendering tasks while we drag them,
    // to the current mouse location when we click anywhere on the screen.
    (<any>$('body')).mousedown((e) => {
      $('app-mouse-container').css("z-index", "20");
      $('app-mouse-container').offset({ left: e.pageX+20, top: e.pageY+20 });

      this.unchecker = !this.unchecker; //uncheck options input, closing options menu

      // Keep the mouse-container glued to the mouse while we are dragging.
      (<any>$('body')).mousemove((e) => {
        var offsetX = e.pageX;
        var offsetY = e.pageY;
        $('app-mouse-container').offset({ left: offsetX+20, top: offsetY+20 });

        // Do not select/highlight anything else while we drag.
        // Only works when a dialog is not open, so that users can select/highlight
        // text in dialogs (such as username, task name, etc.).
        if (!this.taskService.isDialogOpen){document.getSelection().removeAllRanges();}
        // TODO: include logic for when user has selected task search input field.
      })

      // Stop moving the mouse container when we mouse-up or "drop" task.
      .mouseup((e) => {
        $('body').unbind('mousemove');
        $('app-mouse-container').css("z-index", "-20");
      });
    });


    // Scroll to the present hour
    $('.vert-scroll').scrollTop((new Date().getHours()-1)*128);

    // Scroll to the present hour if we use MalihuScrollbar (non-webkit browsers)
    this.mScrollbarService.scrollTo(this.vertScroll.nativeElement, (new Date().getHours()-1)*128, this.scrollbarOptions);

    // Hide the scrollbar on calendar if we use MalihuScrollbar (non-webkit browsers)
    $('#mCSB_1_scrollbar_vertical').css("right", "-20px");
  }


  // When user resizes screen, keep the calendar horizontal scroll precisely on current days
  onResize(){
    this.dateWidth = $('#date').width();
    $('.days-otw, .calendar').scrollLeft(this.dateWidth+1);
  }


  // Scroll left (back in time) a day on the calendar.
  // Adds one day on the left and instantly scrolls right one day width.
  // Then animates a scroll left to seemlessly and smoothly scroll one day left.
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


  // Scroll right (forward in time) a day on the calendar.
  // Adds one day on the right and instantly scrolls left one day width.
  // Then animates a scroll right to seemlessly and smoothly scroll one day right.
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


  // Do not let users scroll horizontally on the calendar without using day buttons.
  keepScroll(){
    $('.vert-scroll').scrollLeft(0);
  }


  // If user drops task not onto calendar, return task to it's origin.
  onMouseUp(){
    this.incService.moveTaskToPreviousLocation();
  }

}
