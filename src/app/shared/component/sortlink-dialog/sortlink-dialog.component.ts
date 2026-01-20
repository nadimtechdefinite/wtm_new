import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sortlink-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,MatButtonModule],
  templateUrl: './sortlink-dialog.component.html',
  styleUrl: './sortlink-dialog.component.scss'
})
export class SortlinkDialogComponent {
  type: string;
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA)
    public data: { type: string; title: string }) {
    console.log(data, 'data');
  this.type  = this.data.type
  this.title  = this.data.title
    
  }
}
