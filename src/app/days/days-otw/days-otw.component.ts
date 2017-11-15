import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-days-otw',
  templateUrl: './days-otw.component.html',
  styleUrls: ['./days-otw.component.css']
})
export class DaysOtwComponent implements OnInit {
	@Input() date: Date;

  constructor() { }

  ngOnInit() {
  }


}
