import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  
  today = new Date();
  leftDay = new Date(new Date().setDate(new Date().getDate()-1));
  rightDay = new Date(new Date().setDate(new Date().getDate()+1));


  // thisYear = this.today.getFullYear();
  // thisMonth = this.today.getMonth();
  // thisDate = this.today.getDate();
  // thisDay = this.today.getDay();
  // nearestSunday = this.thisDate - this.thisDay;


  // Sundays=[];
  // Mondays=[];
  // Tuesdays=[];
  // Wednesdays=[];
  // Thursdays=[];
  // Fridays=[];
  // Saturdays=[];

  ngOnInit() {
    this.today.setHours(0,0,0,0);
    this.leftDay.setHours(0,0,0,0);
    this.rightDay.setHours(0,0,0,0);

  	// for (var _i = 0; _i < 7; _i++){
	  // 	this.dateIteration = new Date(this.thisYear, this.thisMonth, this.nearestSunday+_i);

	  // 	var dayOTW = this.dateIteration.getDay();

  	// 	switch (dayOTW) {
  	// 	 	case 0:
  	// 	 		this.Sundays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 1:
  	// 	 		this.Mondays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 2:
  	// 	 		this.Tuesdays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 3:
  	// 	 		this.Wednesdays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 4:
  	// 	 		this.Thursdays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 5:
  	// 	 		this.Fridays.push(this.dateIteration);
  	// 	 		break;

	 	// 	case 6:
  	// 	 		this.Saturdays.push(this.dateIteration);
  	// 	 		break;
  	// 	 } 
  	// }

  }
}
