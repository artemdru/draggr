import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-present-indicator',
  templateUrl: './present-indicator.component.html',
  styleUrls: ['./present-indicator.component.css']
})
export class PresentIndicatorComponent implements OnInit, AfterViewChecked {

	@ViewChild('present') present: ElementRef;
	public style: Object = {};

	pixelsPerMinute = 2.1333;

  constructor() { }

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

  getMinutes(){
  	var hours = new Date().getHours();
  	return new Date().getMinutes() + hours*60;
  }

}
