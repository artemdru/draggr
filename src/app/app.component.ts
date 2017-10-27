import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  dates: Date[];

  dateWidth: number;
  
  today = new Date();
  leftMostDay = new Date(new Date().setDate(new Date().getDate()-2));
  leftDay = new Date(new Date().setDate(new Date().getDate()-1));
  rightDay = new Date(new Date().setDate(new Date().getDate()+1));
  rightMostDay = new Date(new Date().setDate(new Date().getDate()+2));

  ngOnInit() {
    this.today.setHours(0,0,0,0);
    this.leftMostDay.setHours(0,0,0,0);
    this.leftDay.setHours(0,0,0,0);
    this.rightDay.setHours(0,0,0,0);
    this.rightMostDay.setHours(0,0,0,0);

    this.dates = [this.leftMostDay, this.leftDay, this.today, this.rightDay, this.rightMostDay];

  }

  ngAfterViewInit() {
    this.dateWidth = $('#date').width();
    $('.days-otw').scrollLeft(this.dateWidth);
    $('.calendar').scrollLeft(this.dateWidth);
  }

  onResize(){
    this.dateWidth = $('#date').width();
    $('.days-otw').scrollLeft(this.dateWidth);
    $('.calendar').scrollLeft(this.dateWidth);
  }
}
