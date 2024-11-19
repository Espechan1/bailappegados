import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';
import { take } from 'rxjs';
import { ContainerList } from '../../models/container';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Button, ButtonDirective } from 'primeng/button';
import { DatePipe, NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { StylesService } from '../../services/styles.service';
import { Style } from '../../models/style';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { PremisesService } from '../../services/premises.service';
import { Premise } from '../../models/premise';

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
    ImageModule,
    InputTextModule,
    KeyFilterModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    DatePipe,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [EventsService, StylesService, PremisesService],
})
export class EventsComponent implements OnInit {
  eventsListOriginal: Event[] = [];
  eventsList: Event[] = [];
  event?: Event;
  styles: Map<number, string> = new Map<number, string>();
  premises: Map<number, string> = new Map<number, string>();
  layout: 'list' | 'grid' = 'list';

  private readonly eventsService = inject(EventsService);
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  //formatDate(value.data.opening, "dd/MM/YYYY HH:MM", this.locale)

  ngOnInit(): void {
    this.getStyles();
    this.getAll();
    this.getPremises();
  }

  getStyles() {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        value.data.forEach(style => this.styles.set(style.id, style.name));
      });
  }

  getPremises() {
    this.premisesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        value.data.forEach(premise =>
          this.premises.set(premise.id as number, premise.name),
        );
      });
  }

  getAll(): void {
    this.eventsService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Event>) => {
        this.eventsListOriginal = value.data;
        this.eventsList = value.data;
      });
  }

  // onSortChange(event: KeyboardEvent){
  //   console.log(search)
  // }
  filterPremise(search: KeyboardEvent): void {
    if (search && search.target && (search.target as HTMLInputElement).value) {
      this.eventsList = this.eventsListOriginal.filter(value =>
        value.name
          .toLowerCase()
          .includes((search.target as HTMLInputElement).value?.toLowerCase()),
      );
    } else this.eventsList = this.eventsListOriginal;
  }

  // getById(id: number) {
  //   this.eventsService.getEvent(id)
  //     .pipe(take(1))
  //     .subscribe((value: Container<Event>) => {
  //       this.event = value.data
  //     });
  // }
}
