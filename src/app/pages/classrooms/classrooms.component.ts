import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { ClassroomsService } from '../../services/classrooms.service';
import { ContainerList } from '../../models/container';
import { Classroom } from '../../models/classroom';
import { StylesService } from '../../services/styles.service';
import { PremisesService } from '../../services/premises.service';
import { take } from 'rxjs';
import { Style } from '../../models/style';
import { Premise } from '../../models/premise';
import { Button } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DatePipe, NgForOf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
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
  ],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css',
  providers: [ClassroomsService, StylesService, PremisesService, UsersService],
})
export class ClassroomsComponent implements OnInit {
  private readonly classroomsService = inject(ClassroomsService);
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);
  private readonly usersService = inject(UsersService);
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
}
