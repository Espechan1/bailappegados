import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { ClassroomsService } from '../../services/classrooms.service';
import { ContainerList } from '../../models/container';
import { Classroom } from '../../models/classroom';
import { StylesService } from '../../services/styles.service';
import { PremisesService } from '../../services/premises.service';
import { take } from 'rxjs';
import { Style } from '../../models/style';
import { Premise } from '../../models/premise';

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [],
  templateUrl: './classrooms.component.html',
  styleUrl: './classrooms.component.css',
  providers: [ClassroomsService, StylesService, PremisesService],
})
export class ClassroomsComponent implements OnInit {
  private readonly classroomsService = inject(ClassroomsService);
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);
  constructor(@Inject(LOCALE_ID) public locale: string) {}
  //formatDate(value.data.opening, "dd/MM/YYYY HH:MM", this.locale)

  //classroom?: Classroom;
  classroomListOriginal: Classroom[] = [];
  classroomList: Classroom[] = [];
  styles: Map<number, string> = new Map<number, string>();
  premises: Map<number, string> = new Map<number, string>();

  ngOnInit(): void {
    this.getStyles();
    this.getAll();
    this.getPremises();
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
}
