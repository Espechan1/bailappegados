import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { StylesService } from '../../services/styles.service';
import { StateService } from '../../services/state.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { InputTextModule } from 'primeng/inputtext';
import { MapComponent } from '../../components/map/map.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { Style } from '../../models/style';
import { take } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-form-event',
  standalone: true,
  imports: [
    Button,
    CheckboxModule,
    DividerModule,
    FormsModule,
    ImageCropperComponent,
    InputTextModule,
    MapComponent,
    NgIf,
    NgOptimizedImage,
    PasswordModule,
    PrimeTemplate,
    RouterLink,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './form-event.component.html',
  styleUrl: './form-event.component.css',
  providers: [EventsService, StylesService, StateService],
})
export class FormEventComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly stylesService = inject(StylesService);
  private readonly stateservice = inject(StateService);
  private sanitizer = inject(DomSanitizer);

  isChecked = false;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  styles?: Style[] = [];
  premise_id?: number;

  createEventForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    opening: new FormControl<Date | undefined>(undefined),
    expiration: new FormControl<Date | undefined>(undefined),
    dance_instructors: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(60),
      Validators.minLength(4),
    ]),
    dj: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(4),
    ]),
    price: new FormControl<number | undefined>(undefined),
    premise_id: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
    style_id: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  ngOnInit() {
    this.getStyles();
  }

  getStyles() {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe(value => {
        this.styles = value.data;
      });
  }

  createEvent(): void {
    if (this.isChecked) {
      //  const newEvent: Event = {
      //    ...(this.createEventForm.getRawValue() as unknown as Event),
      // }
      //this.eventsService.create(newEvent)
    }
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    console.log(event);
  }

  imageCropped(event: ImageCroppedEvent) {
    // Se dispara cuando finaliza el recorte de la imagen. El evento proporciona información sobre la imagen recortada, como su URL y datos en formato base64.
    console.log(event);
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl,
      );
    }
  }

  protected readonly String = String;
}
