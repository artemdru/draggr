import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import * as $ from 'jquery';

import { Task } from '../task.model';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit, AfterViewInit {

  @Input() date: Date;
  @Input() weekly: boolean;
  task: Task;

  // Dates of time increments in this day, in seconds since 1/1/1970
  timeIncrements: number[] = [];

  // Determine if this day is today for logic in template for present indicator rendering
  isToday: boolean = false;

  constructor() { }

  ngOnInit() {
    // Start calculating dates from exactly midnight
    this.date.setHours(0,0,0,0);
  	
      var incrementedDate = this.date.getTime();

      // Increment each date by 15 minutes
      for (var _i = 0; _i < 96; _i++){
        this.timeIncrements[_i] = incrementedDate;
        incrementedDate += 15*60000;
      }

    if (this.date.getDate() == new Date().getDate()){
      this.isToday = true;
    }
  }

  ngAfterViewInit() {
    // Scroll to the present hour
    $('.vert-scroll').scrollTop((new Date().getHours()-1)*128);
  }

}
