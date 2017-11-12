import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timebar',
  templateUrl: './timebar.component.html',
  styleUrls: ['./timebar.component.css']
})
export class TimebarComponent implements OnInit {

	times = [];

  constructor() { }

  ngOnInit() {
  	for (let _i = 0; _i<23; _i++){

  		if (_i < 11){
  			this.times[_i] = _i+1 + " AM";
  		} else if (_i === 11) {
  			this.times[_i] = _i+1 + " PM";
  		} else if (_i > 11){
  			this.times[_i] = _i-11 + " PM";
  		}
  	}
  }

}
