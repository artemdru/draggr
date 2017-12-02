import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-greeting-dialog',
  templateUrl: './greeting-dialog.component.html',
  styleUrls: ['./greeting-dialog.component.css']
})
export class GreetingDialogComponent implements OnInit {

  constructor(private cdref: ChangeDetectorRef, public dialogRef: MatDialogRef<GreetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  	// this line is to remove ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();
  }

}
