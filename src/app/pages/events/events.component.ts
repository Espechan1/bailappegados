import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { StylesService } from '../../services/styles.service';
import { RegistrationsService } from '../../services/registrations.service';
import { PremisesService } from '../../services/premises.service';
import { StateService } from '../../services/state.service';
import { Event as EventCustom } from '../../models/event';
import { Premise } from '../../models/premise';
import { Registration } from '../../models/registration';
import { take } from 'rxjs';
import { ContainerList } from '../../models/container';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Button, ButtonDirective } from 'primeng/button';
import { DatePipe, NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { Style } from '../../models/style';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';

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
    CalendarModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [
    EventsService,
    StylesService,
    PremisesService,
    StateService,
    RegistrationsService,
  ],
})
export class EventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);
  private readonly stateService = inject(StateService);
  private readonly registrationServices = inject(RegistrationsService);
  private router = inject(Router);
  protected readonly Number = Number;

  constructor(@Inject(LOCALE_ID) public locale: string) {}
  //formatDate(value.data.opening, "dd/MM/YYYY HH:MM", this.locale)

  eventsListOriginal: EventCustom[] = [];
  eventsList: EventCustom[] = [];
  styles: Map<number, string> = new Map<number, string>();
  stylesList: Style[] = [];
  premises: Map<number, string> = new Map<number, string>();
  premisesSelected: number[] = [];
  premisesList: Premise[] = [];
  stylesSelected: number[] = [];
  premisesMap = new Map<number, Premise>();
  registration: Registration = {};
  layout: 'list' | 'grid' = 'list';
  filteredEvents: EventCustom[] = [];

  ngOnInit(): void {
    this.getStyles();
    this.getAll();
    this.getPremises();
    this.filteredEvents = [...this.eventsList];
  }

  getStyles() {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data;
        value.data.forEach(style => this.styles.set(style.id, style.name));
      });
  }

  getPremises() {
    this.premisesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        this.premisesList = value.data;
        value.data.forEach(premise => {
          const id = premise.id as number;
          this.premises.set(id, premise.name);
          this.premisesMap.set(id, premise);
        });
      });
  }

  getScheduleDayPremise(eventDay: EventCustom): string {
    const parsedDate = new Date(eventDay.opening as Date);
    const premise = this.premisesMap.get(eventDay.premise_id);
    if (premise) {
      switch (parsedDate.getDay()) {
        case 0:
          return premise.schedule?.Sunday ?? '';
        case 1:
          return premise.schedule?.Monday ?? '';
        case 2:
          return premise.schedule?.Tuesday ?? '';
        case 3:
          return premise.schedule?.Wednesday ?? '';
        case 4:
          return premise.schedule?.Thursday ?? '';
        case 5:
          return premise.schedule?.Friday ?? '';
        case 6:
          return premise.schedule?.Saturday ?? '';
      }
    }
    return 'Día no válido';
  }

  getAll(): void {
    this.eventsService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<EventCustom>) => {
        this.eventsListOriginal = value.data;
        this.eventsList = value.data;
      });
  }

  registrationUser(clickedEvent: number) {
    if (
      this.stateService.userLogged.isLogged &&
      this.stateService.token &&
      this.stateService.token.userId &&
      this.registration
    ) {
      this.registration.user_id = this.stateService.token.userId as number;
      this.registration.event_id = clickedEvent as number;
      if (confirm('¿Quieres buscar pareja de baile para este evento?')) {
        this.registration.state_match = 'Available';
      } else {
        this.registration.state_match = 'Not Available';
      }
      this.registrationServices
        .create(this.registration)
        .pipe(take(1))
        .subscribe(value => {
          if (value.status == 'Error') {
            alert(value.data);
          }
          if (value.status == 'Success') {
            alert(value.data);
          }
        });
    } else {
      alert(
        'Tienes que estar logueado para inscribirte como participante a un evento.',
      );
      console.log(
        'El registro no existe, revisa la variable registration que has creado.',
      );
    }
  }

  onEventSelected(eventId: number) {
    this.router.navigate(['/registrations/' + eventId]).then();
  }

  filterByName(search: KeyboardEvent): void {
    if (search && search.target && (search.target as HTMLInputElement).value) {
      this.eventsList = this.eventsListOriginal.filter(value =>
        value.name
          .toLowerCase()
          .includes((search.target as HTMLInputElement).value?.toLowerCase()),
      );
    } else this.eventsList = this.eventsListOriginal;
  }

  onChangeSelectedStyles(event: MultiSelectChangeEvent) {
    this.stylesSelected = event.value.map((v: Style) => {
      return v.id;
    });
    this.filterEvents();
  }

  onChangePremisesStyles(event: MultiSelectChangeEvent) {
    this.premisesSelected = event.value.map((v: Style) => {
      return v.id;
    });
    this.filterEvents();
  }

  onChangeByDate(event: Event) {
    console.log(event);
    // this.filteredEvents = [
    //   ...this.eventsList.filter(ev => {
    //     return (ev.opening?.getDate() >= event) as unknown as Date;
    //   }),
    // ];
  }

  filterEvents() {
    this.eventsList = this.eventsListOriginal.filter(e => {
      return (
        (this.stylesSelected.length == 0 ||
          this.stylesSelected.includes(e.style_id)) &&
        (this.premisesSelected.length == 0 ||
          this.premisesSelected.includes(e.premise_id))
      );
    });
  }
}
