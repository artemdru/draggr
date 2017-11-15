import { Directive, HostListener, Output, EventEmitter, Input, NgZone, OnInit, ElementRef } from '@angular/core';

import { TaskService } from './task.service';
import { TimeIncrementService } from './time-increment.service';
import { Task } from './task.model';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective implements OnInit {
	@Input() date: Date;
  @Input() container: ElementRef;

	@Output('onDrop') drop = new EventEmitter();

  constructor(private taskService: TaskService, private timeIncService: TimeIncrementService, private ngZone: NgZone, private elRef: ElementRef) { }

  ngOnInit() {
  	this.ngZone.runOutsideAngular(() => {
  			this.elRef.nativeElement.addEventListener('dragover', (event: Event) => {
  				event.preventDefault();

  			});
        this.elRef.nativeElement.addEventListener('dragenter', (event: Event) => {
          event.preventDefault();
            if (this.container !== undefined){
              this.container.nativeElement.style.backgroundColor = 'silver';
            }
        });
        this.elRef.nativeElement.addEventListener('dragleave', (event: Event) => {
          event.preventDefault();
          if (this.container !== undefined){
              this.container.nativeElement.style.backgroundColor = 'transparent';
            }
        });
  		});
  }


  	@HostListener('drop') onDrop (event: Event){
      this.timeIncService.moveTask(this.taskService.selectedTask, this.date);

      if (this.timeIncService.moveSuccessful === true){
        this.taskService.selectedTask.date=this.date;
        this.taskService.emitTask(this.taskService.selectedTask);
      }  		
	}
}
