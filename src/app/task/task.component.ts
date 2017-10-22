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
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
    // this.newTime.next((event.rectangle.height/20) * 15);
    // this.timeElRef.nativeElement.innerHTML = (event.rectangle.height/20) * 15;
    // this.renderer.setValue(this.timeElRef.nativeElement.innerHTML, '420');
    // console.log(this.timeElRef.nativeElement.innerHTML);
    this.task.time = (event.rectangle.height/20) * 15;
  }

  // onResizeEnd(event: ResizeEvent): void {
  //   this.style = {
  //     // position: 'fixed',
  //     // left: `${event.rectangle.left}px`,
  //     // top: `${event.rectangle.top}px`,
  //     width: `${event.rectangle.width}px`,
  //     height: `${event.rectangle.height}px`
  //   };
  //   this.task.time = (event.rectangle.height/20) * 15;
  // }

  // onResizing(event: ResizeEvent): void {
  //     this.style = {
  //     // position: 'fixed',
  //     // left: `${event.rectangle.left}px`,
  //     // top: `${event.rectangle.top}px`,
  //     width: `${event.rectangle.width}px`,
  //     height: `${event.rectangle.height}px`
  //   };
  //   this.task.time = (event.rectangle.height/20) * 15;
  // }


}
