import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../../shared/material/material';



@Component({
  selector: 'app-screen-reader',
  standalone: true,
  imports: [CommonModule, MATERIAL_MODULES ],
  templateUrl: './screen-reader.component.html',
  styleUrl: './screen-reader.component.scss'
})
export class ScreenReaderComponent {

  displayedColumns: string[] = [
    'sno',
    'name',
    'link',
    'type'
  ];

  dataSource = new MatTableDataSource([
    {
      sno: 1,
      name: 'Non Visual Desktop Access (NVDA)',
      link: 'https://www.nvda-project.org/',
      type: 'Free'
    },
    {
      sno: 2,
      name: 'Screen Access For All (SAFA)',
      link: 'https://safa-reader.software.informer.com/download/',
      type: 'Free'
    },
    {
      sno: 3,
      name: 'System Access To Go',
      link: 'https://www.satogo.com/',
      type: 'Free'
    },
    {
      sno: 4,
      name: 'Thunder',
      link: 'https://www.screenreader.net/index.php?pageid=11',
      type: 'Free'
    },
    {
      sno: 5,
      name: 'WebAnywhere',
      link: 'https://webanywhere.cs.washington.edu/wa.php',
      type: 'Free'
    },
    {
      sno: 6,
      name: 'Hal',
      link: 'https://www.yourdolphin.co.uk/productdetail.asp?id=5',
      type: 'Commercial'
    },
    {
      sno: 7,
      name: 'JAWS',
      link: 'https://www.freedomscientific.com/products/blindness/jaws/',
      type: 'Commercial'
    },
    {
      sno: 8,
      name: 'Window-Eyes',
      link: 'https://www.gwmicro.com/window-eyes/',
      type: 'Commercial'
    },
    {
      sno: 9,
      name: 'Supernova',
      link: 'https://www.yourdolphin.co.uk/productdetail.asp?id=1',
      type: 'Commercial'
    }
  ]);
}
