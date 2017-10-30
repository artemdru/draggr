import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

	@Input() task: Task;
	public style: Object = {};
  
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
  }

  onResizing(event: ResizeEvent): void {
      this.style = {
      height: `${event.rectangle.height}px`
    };
    this.task.time = ((event.rectangle.height+6)/32) * 15;
  }
}
