import { Component, inject, OnInit } from '@angular/core';
import { Premise } from '../../models/premise';
import { PremisesService } from '../../services/premises.service';
import { JsonPipe, NgForOf, NgOptimizedImage } from '@angular/common';
import { take } from 'rxjs';
import { Container, ContainerList } from '../../models/container';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';

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
  ],
  templateUrl: './premises.component.html',
  styleUrl: './premises.component.css',
  providers: [PremisesService],
})
export class PremisesComponent implements OnInit {
  premisesList: Premise[] = [];
  premise?: Premise;

  private readonly premisesService = inject(PremisesService); // = constructor(private readonly premisesService: PremisesService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.premisesService
      .getPremises()
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        this.premisesList = value.data;
        console.log(this.premisesList, value);
      });
  }

  getById(id: number) {
    this.premisesService
      .getById(id)
      .pipe(take(1))
      .subscribe((value: Container<Premise>) => {
        this.premise = value.data;
      });
  }
}
