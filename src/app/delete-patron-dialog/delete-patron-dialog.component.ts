import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-patron-dialog',
  templateUrl: './delete-patron-dialog.component.html',
  styleUrls: ['./delete-patron-dialog.component.scss']
})

export class DeletePatronDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: string) {}

  ngOnInit() {
  }

}
