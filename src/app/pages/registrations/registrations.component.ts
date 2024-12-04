import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrations',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.css',
  providers: [UsersService],
})
export class RegistrationsComponent implements OnInit {
  usersRegistered!: User[];

  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  eventId!: number;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'))!;
    });
    if (this.eventId) {
      this.usersService
        .getUsersByEventId(this.eventId)
        .pipe(take(1))
        .subscribe(users => {
          this.usersRegistered = users.data;
        });
    }
  }
}
