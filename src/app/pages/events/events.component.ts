import {Component, Inject, inject, LOCALE_ID, OnInit} from '@angular/core';
import {Event} from '../../models/event';
import {EventsService} from '../../services/events.service';
import {take} from 'rxjs';
import {Container, ContainerList} from '../../models/container';
import {DataViewModule} from 'primeng/dataview';
import {TagModule} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {StylesService} from '../../services/styles.service';
import { Style } from '../../models/style';
import {ImageModule} from 'primeng/image';


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
    NgOptimizedImage,
    ImageModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [EventsService, StylesService]
})
export class EventsComponent implements OnInit {
  eventsList: Event[] = [];
  event?: Event;
  styleName?: string;

  private readonly eventsService = inject(EventsService);
  private readonly stylesService = inject(StylesService);

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
      });
  }

  getById(id: number) {
    this.eventsService.getEvent(id)
      .pipe(take(1))
      .subscribe((value: Container<Event>) => {
        this.event = value.data
      });
  }

  getStyle(id: number){
    this.stylesService.getStyle(id)
      .pipe(take(1))
      .subscribe((value: Container<Style>)=> {
        this.styleName = value.data.name
      })
  }
}
