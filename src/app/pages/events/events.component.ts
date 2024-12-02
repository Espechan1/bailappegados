import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { StylesService } from '../../services/styles.service';
import { RegistrationsService } from '../../services/registrations.service';
import { PremisesService } from '../../services/premises.service';
import { StateService } from '../../services/state.service';
import { Event } from '../../models/event';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';

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

  eventsListOriginal: Event[] = [];
  eventsList: Event[] = [];
  event?: Event;
  styles: Map<number, string> = new Map<number, string>();
  premises: Map<number, string> = new Map<number, string>();
  premisesMap = new Map<number, Premise>();
  registration: Registration = {};
  layout: 'list' | 'grid' = 'list';

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
        value.data.forEach(premise => {
          const id = premise.id as number;
          this.premises.set(id, premise.name);
          this.premisesMap.set(id, premise);
        });
      });
  }

  getScheduleDayPremise(eventDay: Event): string {
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
      .subscribe((value: ContainerList<Event>) => {
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
      console.log(this.registration);
      this.registrationServices
        .create(this.registration)
        .pipe(take(1))
        .subscribe(value => {
          alert(value.data);
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

  filterPremise(search: KeyboardEvent): void {
    if (search && search.target && (search.target as HTMLInputElement).value) {
      this.eventsList = this.eventsListOriginal.filter(value =>
        value.name
          .toLowerCase()
          .includes((search.target as HTMLInputElement).value?.toLowerCase()),
      );
    } else this.eventsList = this.eventsListOriginal;
  }
}
