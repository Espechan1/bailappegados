import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { take } from 'rxjs';
import { PremisesService } from '../../services/premises.service';
import { UsersService } from '../../services/users.service';
import { Premise, Gps, Schedule } from '../../models/premise';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-form-premise',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    Button,
    CalendarModule,
    CheckboxModule,
    DividerModule,
    MultiSelectModule,
    NgIf,
    NgOptimizedImage,
    PasswordModule,
    PrimeTemplate,
    RadioButtonModule,
    RouterLink,
    ImageCropperComponent,
    FormsModule,
    MapComponent,
  ],
  templateUrl: './form-premise.component.html',
  styleUrl: './form-premise.component.css',
  providers: [PremisesService, UsersService],
})
export class FormPremiseComponent {
  private readonly premisesService = inject(PremisesService);
  private readonly usersService = inject(UsersService);
  private sanitizer = inject(DomSanitizer);

  gps?: Gps;
  isChecked = false;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  createPremiseForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    address: new FormControl<string>('', Validators.required),
    phone_number: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(13),
    ]),
    web: new FormControl<string | null>(null, Validators.maxLength(50)),
    person_contact: new FormControl<string | null>(null, [
      Validators.maxLength(50),
    ]),
    images: new FormControl<Photo[] | null>(null), // undefined = {}
    location: new FormControl<Gps | null>(null),
    schedule: new FormGroup({
      Monday: new FormControl<string | null>(null),
      Tuesday: new FormControl<string | null>(null),
      Wednesday: new FormControl<string | null>(null),
      Thursday: new FormControl<string | null>(null),
      Friday: new FormControl<string | null>(null),
      Saturday: new FormControl<string | null>(null),
      Sunday: new FormControl<string | null>(null),
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.max(20),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!?@#$%^&*()_+])?[a-zA-Z\d-!?@#$%^&*()_+]{8,20}$/,
      ),
    ]),
  });

  handleMapClick(coords: Gps): void {
    console.log(`lat: ${coords.lat}, lng: ${coords.lng}`);
  }

  createPremise(): void {
    if (this.isChecked) {
      const form = this.createPremiseForm.get('scheduleForm');
      const scheduleData = form ? (form.value as Schedule) : null;
      const newManager: User = {
        id: undefined as unknown as number,
        name: this.createPremiseForm.get('person_contact') as unknown as string,
        description: undefined,
        email: this.createPremiseForm.get('email') as unknown as string,
        location: undefined,
        birthday: undefined,
        password: this.createPremiseForm.get('password') as unknown as string,
        genre: undefined,
        roles: [{ id: 2, role: 'manager' }],
        images: undefined,
        styles: undefined,
      };
      const newPremise: Premise = {
        ...(this.createPremiseForm.getRawValue() as unknown as Premise),
        schedule: scheduleData,
        location: this.gps as unknown as Gps,
      };
      this.usersService
        .create(newManager)
        .pipe(take(1))
        .subscribe({
          next: value => {
            console.log(value);
          },
          error: err => {
            console.log(err);
          },
        });
      this.premisesService
        .create(newPremise)
        .pipe(take(1))
        .subscribe({
          next: value => {
            console.log(value);
          },
          error: err => {
            console.log(err);
          },
        });
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
  onCreate() {
    if (this.createPremiseForm.invalid) {
      console.log('Algo ta mal');
      for (const controlsKey in this.createPremiseForm.controls) {
        this.createPremiseForm.get(controlsKey)?.markAsDirty();
        this.createPremiseForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }

  // get nameForm(){ //getter del name del form O.o
  // return this.createPremiseForm.get('name') as AbstractControl
  // }
}
