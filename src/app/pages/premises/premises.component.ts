import { Component, inject, OnInit } from '@angular/core';
import { Premise } from '../../models/premise';
import { PremisesService } from '../../services/premises.service';
import { JsonPipe, NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { take } from 'rxjs';
import { ContainerList } from '../../models/container';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { BrokenImageDirective } from '../../directives/broken-image.directive';

@Component({
  selector: 'app-premises',
  standalone: true,
  imports: [
    NgForOf,
    TableModule,
    CardModule,
    Button,
    RouterLink,
    JsonPipe,
    NgOptimizedImage,
    ImageModule,
    DataViewModule,
    NgClass,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    BrokenImageDirective,
  ],
  templateUrl: './premises.component.html',
  styleUrl: './premises.component.css',
  providers: [PremisesService],
})
export class PremisesComponent implements OnInit {
  premisesList: Premise[] = [];
  //premisesListOriginal: Premise[] = [];

  private readonly premisesService = inject(PremisesService); // = constructor(private readonly premisesService: PremisesService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.premisesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        //value = status y data
        this.premisesList = value.data; //array de objetos de tipo premise
        console.log(value.data);
      });
  }

  // getById(id: number) {
  //   this.premisesService
  //     .getPremise(id)
  //     .pipe(take(1))
  //     .subscribe((value: Container<Premise>) => {
  //       this.premise = value.data;
  //     });
  // }

  // filterPremises(search: KeyboardEvent): void {
  //   if (search && search.target && search.target['value'])
  //     { // @ts-ignore
  //       this.premisesList = this.premisesListOriginal.filter(value =>
  //               value.name.toLowerCase().includes(search.target?['value']?.toLowerCase()),
  //             );
  //     }
  //   else this.premisesList = this.premisesListOriginal;
  //}
}
