import {Component, Inject, inject, LOCALE_ID, OnInit} from '@angular/core';
import {Event} from '../../models/event';
import {EventsService} from '../../services/events.service';
import {take} from 'rxjs';
import {Container, ContainerList} from '../../models/container';
import {DataViewModule} from 'primeng/dataview';
import {TagModule} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {formatDate, NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {Ripple} from 'primeng/ripple';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    DataViewModule,
    TagModule,
    Button,
    NgForOf,
    NgClass,
    ButtonDirective,
    Ripple,
    NgOptimizedImage
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [EventsService]
})
export class EventsComponent implements OnInit {
  eventsList: Event[] = [];
  event?: Event;
  private readonly eventsService = inject(EventsService);

  constructor( @Inject(LOCALE_ID) public locale: string){}
  //formatDate(value.data.opening, "dd/MM/YYYY HH:MM", this.locale)

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    this.eventsService.getEvents()
      .pipe(take(1))
      .subscribe((value: ContainerList<Event>) => { //status y data
        this.eventsList = value.data
        console.log(`Esto es eventsList ${this.eventsList[6].images[0].url}`)
      })
  }

  getById(id: number) {
    this.eventsService.getEvent(id)
      .pipe(take(1))
      .subscribe((value: Container<Event>) => {
        this.event = value.data
      })
  }
}
