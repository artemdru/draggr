import { Injectable } from '@angular/core';

import { TaskService } from './task.service';

@Injectable()
export class DateService {

	today = new Date();
	  leftMostDay = new Date(new Date().setDate(new Date().getDate()-2));
	  leftDay = new Date(new Date().setDate(new Date().getDate()-1));
	  rightDay = new Date(new Date().setDate(new Date().getDate()+1));
	  rightMostDay = new Date(new Date().setDate(new Date().getDate()+2));

    dates = [this.leftMostDay, this.leftDay, this.today, this.rightDay, this.rightMostDay];

  constructor(private taskService: TaskService) { }

  addDay(dir: string){
  	if (dir === 'back'){
  		this.dates.splice(4, 1);
    	this.dates.unshift(new Date(new Date().setDate(this.dates[0].getDate()-1)));
  	} else if (dir === 'fwd'){
  		this.dates.splice(0, 1);
    	this.dates.push(new Date(new Date().setDate(this.dates[3].getDate()+1)));
  	}
  }
}
