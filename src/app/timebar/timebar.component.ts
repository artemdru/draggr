import { Component, OnInit } from '@angular/core';

import { TaskService } from '../services/task.service';
import { TimeIncrementService } from '../services/time-increment.service';

@Component({
  selector: 'app-timebar',
  templateUrl: './timebar.component.html',
  styleUrls: ['./timebar.component.css']
})
export class TimebarComponent implements OnInit {

	times = [];

  constructor(private taskService: TaskService, private incService: TimeIncrementService) { }

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

  onMouseUp(){
    this.incService.moveTaskToPreviousLocation();
  }

}
