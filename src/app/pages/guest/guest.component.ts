import { Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { EventsService } from '../../services/events.service';
import { MapComponent } from '../../components/map/map.component';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Button, ButtonDirective } from 'primeng/button';
import { take } from 'rxjs';
import { ContainerList } from '../../models/container';
import { Event } from '../../models/event';
import { Ripple } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MapComponent,
    CarouselModule,
    TagModule,
    Button,
    ButtonDirective,
    Ripple,
  ],
  providers: [EventsService],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css',
})
export class GuestComponent implements OnInit {
  private router = inject(Router);

  eventsList: Event[] = [];
  responsiveOptions: CarouselResponsiveOptions[] = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  private readonly eventsService = inject(EventsService);

  ngOnInit() {
    this.eventsService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Event>) => {
        this.eventsList = value.data;
      });
  }

  onRegister() {
    this.router.navigate(['register']).then();
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'INSTOCK':
  //       return 'success';
  //     case 'LOWSTOCK':
  //       return 'warning';
  //     case 'OUTOFSTOCK':
  //       return 'danger';
  //   }
  // }
}
