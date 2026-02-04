import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loaders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loaders.component.html',
  styleUrl: './loaders.component.scss'
})
export class LoadersComponent {
  loading$ = this.loader.loading$;

constructor(private loader: LoaderService){}
}

