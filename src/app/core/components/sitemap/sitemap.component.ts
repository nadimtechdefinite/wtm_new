import { Component, ElementRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SortlinkDialogComponent } from '../../../shared/component/sortlink-dialog/sortlink-dialog.component';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss'
})
export class SitemapComponent {
constructor(private eRef:ElementRef, private dialog:MatDialog){}

  ngOnInit(): void {}


    openDialog(type: string, title:any) {
    this.dialog.open(SortlinkDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: {
        type:type,
        title:title
      },
    });
  }
}
