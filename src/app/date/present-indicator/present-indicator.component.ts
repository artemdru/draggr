import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-present-indicator',
  templateUrl: './present-indicator.component.html',
  styleUrls: ['./present-indicator.component.css']
})

// Present indicator is a red arrow indicating the current time on the calendar.

export class PresentIndicatorComponent implements OnInit, AfterViewChecked {

	@ViewChild('present') present: ElementRef;
	public style: Object = {};

  // A minute on the calendar is roughly 2.1333 pixels
  pixelsPerMinute = 2.1333;

  constructor() { }


  // Set the distance from midnight (top) on initiation and every time
  // view is checked.
  ngOnInit() {
  	this.style = {
  		top: this.pixelsPerMinute*this.getMinutes()-3.5 + 'px'
  	}
  }

  ngAfterViewChecked(){
  	this.style = {
  		top: this.pixelsPerMinute*this.getMinutes()-3.5 + 'px'
  	}
  }

  // Gets the current time in minutes from midnight.
  getMinutes(){
  	var hours = new Date().getHours();
  	return new Date().getMinutes() + hours*60;
  }

}
