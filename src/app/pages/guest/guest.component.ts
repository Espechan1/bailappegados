import {Component} from '@angular/core';
import { NgOptimizedImage} from '@angular/common';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  providers: [EventsService],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css'
})
export class GuestComponent {


}
