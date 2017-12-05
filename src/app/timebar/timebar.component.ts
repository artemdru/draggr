import { Component, OnInit } from '@angular/core';

import { TaskService } from '../task.service';
import { TimeIncrementService } from '../time-increment.service';

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
    if (this.taskService.selectedTask !== null){
      if (this.taskService.selectedTask.previousDate !== 1){
        this.incService.moveTask(this.taskService.selectedTask, this.taskService.selectedTask.previousDate);
        if (this.incService.moveSuccessful === true){
          this.taskService.selectedTask.date=this.taskService.selectedTask.previousDate;
          this.taskService.selectedTask.previousDate = 0;
          this.taskService.emitTask(this.taskService.selectedTask);
          this.taskService.selectedTask = null;
        }
      } else if (this.taskService.selectedTask.previousDate === 1){
        this.taskService.sendBackToTaskWindow();
      }
          
    }
  }

}
