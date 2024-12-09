import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { StylesService } from '../../services/styles.service';
import { PremisesService } from '../../services/premises.service';
import { ClassroomsService } from '../../services/classrooms.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Style } from '../../models/style';
import { take } from 'rxjs';
import { Premise } from '../../models/premise';
import { ClassroomOutput } from '../../models/classroom';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-form-class',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ImageCropperComponent,
    InputNumberModule,
    InputTextModule,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './form-class.component.html',
  styleUrl: './form-class.component.css',
  providers: [StylesService, PremisesService, ClassroomsService, StateService],
})
export class FormClassComponent implements OnInit {
  private readonly stylesService = inject(StylesService);
  private readonly premisesService = inject(PremisesService);
  private readonly stateService = inject(StateService);
  private readonly classroomsService = inject(ClassroomsService);
  private sanitizer = inject(DomSanitizer);

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  styles?: Style[] = [];
  errorsMap = new Map<string, string>();
  premisesList?: { id: number | undefined; name: string }[];
  newClass?: ClassroomOutput;
  protected readonly String = String;

  createClassForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    opening: new FormControl<Date | undefined>(undefined),
    expiration: new FormControl<Date | undefined>(undefined),
    phone_number: new FormControl<number | undefined>(undefined),
    //capacity: new FormControl<number | undefined>(undefined),
    price: new FormControl<number | undefined>(undefined),
    premise_id: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
    teacher_id: new FormControl<number | undefined>(undefined),
    style_id: new FormControl<number | undefined>(undefined, [
      Validators.required,
      Validators.min(1),
    ]),
    images: new FormControl<Blob | undefined>(undefined),
  });

  ngOnInit() {
    this.getStyles();
    this.getPremises();
  }

  createClass() {
    this.createClassForm.controls.teacher_id.setValue(
      this.stateService.token?.userId as number,
    );
    this.newClass =
      this.createClassForm.getRawValue() as unknown as ClassroomOutput;
    this.classroomsService
      .create(this.newClass)
      .pipe(take(1))
      .subscribe(() => {
        alert('Clase añadida correctamente');
      });
  }

  errorsValidation() {
    if (this.createClassForm.invalid) {
      console.log('Algo ta mal');
      for (const controlsKey in this.createClassForm.controls) {
        this.createClassForm.get(controlsKey)?.markAsDirty();
        this.createClassForm.get(controlsKey)?.updateValueAndValidity();
        const errors = this.createClassForm.get(controlsKey)?.errors;
        if (errors) {
          this.errorsMap.set(controlsKey, Object.keys(errors)[0]);
        }
      }
      return;
    }
  }

  getStyles(): void {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe(value => {
        this.styles = value.data;
      });
  }

  getPremises() {
    this.premisesService
      .getAll()
      .pipe(take(1))
      .subscribe(value => {
        this.premisesList = value.data.map((premise: Premise) => ({
          // Aplicamos el map sobre response.data, no sobre cada premise
          id: premise.id,
          name: premise.name,
        }));
      });
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    // console.log(event);
  }

  imageCropped(event: ImageCroppedEvent) {
    // Se dispara cuando finaliza el recorte de la imagen. El evento proporciona información sobre la imagen recortada, como su URL y datos en formato base64.
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl,
      );
      if (event.blob) {
        this.createClassForm.controls['images'].setValue(event.blob);
      }
    }
  }
}
