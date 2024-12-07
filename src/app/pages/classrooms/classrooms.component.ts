import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { ClassroomsService } from '../../services/classrooms.service';
import { StateService } from '../../services/state.service';
import { UsersService } from '../../services/users.service';
import { StylesService } from '../../services/styles.service';
import { ContainerList } from '../../models/container';
import { PremisesService } from '../../services/premises.service';
import { Classroom } from '../../models/classroom';
import { User } from '../../models/user';
import { Style } from '../../models/style';
import { Premise } from '../../models/premise';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [
    Button,
    DataViewModule,
    DatePipe,
    IconFieldModule,
    ImageModule,
    InputIconModule,
    InputTextModule,
    NgForOf,
    PrimeTemplate,
    TagModule,
    CalendarModule,
    MultiSelectModule,
    NgIf,
  ],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css',
  providers: [
    ClassroomsService,
    StylesService,
    PremisesService,
    StateService,
    UsersService,
  ],
})
export class ClassroomsComponent implements OnInit {
  private readonly classroomsService = inject(ClassroomsService);
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);
  private readonly stateService = inject(StateService);
  private readonly usersService = inject(UsersService);
  private router = inject(Router);
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  //formatDate(value.data.opening, "dd/MM/YYYY HH:MM", this.locale)

  selectedDate?: Date;
  classroomListOriginal: Classroom[] = [];
  classroomList: Classroom[] = [];
  stylesList: Style[] = [];
  premisesSelected: number[] = [];
  premisesList: Premise[] = [];
  stylesSelected: number[] = [];
  stylesMap: Map<number, string> = new Map<number, string>();
  premisesName: Map<number, string> = new Map<number, string>();
  teachers: Map<number, string> = new Map<number, string>();
  layout: 'list' | 'grid' = 'list';
  // registeredClasses: number[] = [];

  ngOnInit(): void {
    this.getStyles();
    this.getAll();
    this.getPremises();
    this.getTeachers();
  }

  getAll(): void {
    this.classroomsService
      .getAll()
      .pipe()
      .subscribe((value: ContainerList<Classroom>) => {
        this.classroomListOriginal = value.data;
        this.classroomList = value.data;
      });
  }

  getStyles() {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data;
        value.data.forEach(style => this.stylesMap.set(style.id, style.name));
      });
  }

  getPremises() {
    this.premisesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        value.data.forEach(premise =>
          this.premisesName.set(premise.id as number, premise.name),
        );
      });
  }

  getTeachers(): void {
    this.usersService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<User>) => {
        value.data.forEach(user =>
          this.teachers.set(user.id as number, user.name),
        );
      });
  }

  // registrationUser(clickedEvent: number) {
  //   if (
  //     this.stateService.userLogged.isLogged &&
  //     this.stateService.token &&
  //     this.stateService.token.userId &&
  //     this.registration
  //   ) {
  //     this.registration.user_id = this.stateService.token.userId as number;
  //     this.registration.event_id = clickedEvent as number;
  //     if (confirm('¿Quieres buscar pareja de baile para este evento?')) {
  //       this.registration.state_match = 'Available';
  //     } else {
  //       this.registration.state_match = 'Not Available';
  //     }
  //     this.registrationServices
  //       .create(this.registration)
  //       .pipe(take(1))
  //       .subscribe(value => {
  //         if (value.status === 'Error') {
  //           alert(value.data);
  //         }
  //         if (value.status === 'Success') {
  //           alert(value.data);
  //           this.registeredEvents.push(clickedEvent);
  //         }
  //       });
  //   } else {
  //     alert(
  //       'Tienes que estar logueado para inscribirte como participante a un evento.',
  //     );
  //   }
  // }

  viewParticipants(classId: number) {
    this.router.navigate(['/enrolled/' + classId]).then();
  }

  filterName(search: KeyboardEvent): void {
    if (search && search.target && (search.target as HTMLInputElement).value) {
      this.classroomList = this.classroomListOriginal.filter(value =>
        value.name
          .toLowerCase()
          .includes((search.target as HTMLInputElement).value?.toLowerCase()),
      );
    } else this.classroomList = this.classroomListOriginal;
  }

  onChangeSelectedStyles(event: MultiSelectChangeEvent) {
    this.stylesSelected = event.value.map((v: Style) => {
      return v.id;
    });
    this.filterClassrooms();
  }

  onChangePremisesStyles(event: MultiSelectChangeEvent) {
    this.premisesSelected = event.value.map((v: Style) => {
      return v.id;
    });
    this.filterClassrooms();
  }

  filterClassrooms() {
    this.classroomList = this.classroomListOriginal.filter(c => {
      return (
        (this.stylesSelected.length == 0 ||
          this.stylesSelected.includes(c.style_id)) &&
        (this.premisesSelected.length == 0 ||
          this.premisesSelected.includes(c.premise_id)) &&
        (this.selectedDate == undefined ||
          this.selectedDate.toLocaleDateString() ==
            c.opening?.toLocaleDateString())
      );
    });
  }

  protected readonly Number = Number;
}
