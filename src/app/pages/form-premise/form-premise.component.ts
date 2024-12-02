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
import { Premise, Gps, Schedule } from '../../models/premise';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Photo } from '../../models/photo';
import { MapComponent } from '../../components/map/map.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';

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
    DropdownModule,
    InputMaskModule,
  ],
  templateUrl: './form-premise.component.html',
  styleUrl: './form-premise.component.css',
  providers: [PremisesService],
})
export class FormPremiseComponent {
  private readonly premisesService = inject(PremisesService);
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
      monday: new FormControl<string | null>(null),
      tuesday: new FormControl<string | null>(null),
      wednesday: new FormControl<string | null>(null),
      thursday: new FormControl<string | null>(null),
      friday: new FormControl<string | null>(null),
      saturday: new FormControl<string | null>(null),
      sunday: new FormControl<string | null>(null),
    }),
    user_id: new FormControl<number | null>(null),
  });

  handleMapClick(coords: Gps): void {
    console.log(`lat: ${coords.lat}, lng: ${coords.lng}`);
  }

  createPremise(): void {
    if (this.isChecked) {
      const form = this.createPremiseForm.get('scheduleForm');
      const scheduleData = form ? (form.value as Schedule) : null;
      const newPremise: Premise = {
        ...(this.createPremiseForm.getRawValue() as unknown as Premise),
        schedule: scheduleData,
        location: this.gps as unknown as Gps,
      };

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
