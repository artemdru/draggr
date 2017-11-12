import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-day-button',
  templateUrl: './day-button.component.html',
  styleUrls: ['./day-button.component.css']
})
export class DayButtonComponent implements OnInit {

	@Input() dir: string;

  constructor() { }

  ngOnInit() {
  }

}
