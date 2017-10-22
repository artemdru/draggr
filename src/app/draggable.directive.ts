import { Directive, HostBinding, HostListener, OnInit, Input } from '@angular/core';

import { TaskService } from './task.service';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit{
	@HostBinding('draggable') draggable: string;
	@Input() taskName: string;
	@Input() taskID: number;

  constructor(private taskService: TaskService) { }


	ngOnInit(){
		this.draggable = "true";
	}

	@HostListener('dragstart') onDragStart (event: Event){
		this.taskService.selectTask(this.taskID);
	}

}
