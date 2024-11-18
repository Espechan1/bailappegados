import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [NgOptimizedImage, MapComponent],
  providers: [EventsService],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css',
})
export class GuestComponent {}
