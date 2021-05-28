import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  message: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) { 
    this.message = this.data && this.data.message ? this.data.message : '正在载入...'
  }

  ngOnInit(): void {
  }

}
