import {Component, Inject, inject, LOCALE_ID, OnInit} from '@angular/core';
import {Event} from '../../models/event';
import {EventsService} from '../../services/events.service';
import {take} from 'rxjs';
import {Container, ContainerList} from '../../models/container';
import {DataViewModule} from 'primeng/dataview';
import {TagModule} from 'primeng/tag';
import {Button} from 'primeng/button';
import {formatDate, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    DataViewModule,
    TagModule,
    Button,
    NgForOf,
    NgClass
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
      .subscribe((value: ContainerList<Event>) => {
        this.eventsList = value.data
      })
  }

  getById(id: number) {
    this.eventsService.getById(id)
      .pipe(take(1))
      .subscribe((value: Container<Event>) => {
        this.event = value.data
        console.log(this.event)
      })
  }
}
