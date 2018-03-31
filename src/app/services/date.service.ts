import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

	weeklyView: boolean = false;



  // Create 5 dates to render in the calendar. Left-most and right-most dates
  // will always be out of view, but pre-rendered for smoothness in scrolling days.
	today = new Date();
	  leftMostDay = new Date(new Date().setDate(new Date().getDate()-2));
	  leftDay = new Date(new Date().setDate(new Date().getDate()-1));
	  rightDay = new Date(new Date().setDate(new Date().getDate()+1));
	  rightMostDay = new Date(new Date().setDate(new Date().getDate()+2));

		dates = [this.leftMostDay, this.leftDay, this.today, this.rightDay, this.rightMostDay];
		

  constructor() { }

  // Modifies the dates array to shift one day left (back in time), or one day
  // right (forward in time).
  addDay(dir: string){
  	if (dir === 'back'){
  		this.dates.splice(4, 1);
    	this.dates.unshift(new Date(new Date().setDate(this.dates[0].getDate()-1)));
  	} else if (dir === 'fwd'){
  		this.dates.splice(0, 1);
    	this.dates.push(new Date(new Date().setDate(this.dates[3].getDate()+1)));
  	}
	}
	
	week = [];
	

	initWeek(day: Date){
		var dayOTW = day.getDay();

		for (var _i = -1*dayOTW; _i <=(6-dayOTW); _i++){
			this.week.push(new Date(new Date().setDate(new Date().getDate()+_i)));
		}
		console.log(this.week);
	}

	

}
