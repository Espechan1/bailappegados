import { Component, inject, OnInit } from '@angular/core';
import { Style } from '../../models/style';
import { StylesService } from '../../services/styles.service';
import { JsonPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { take } from 'rxjs';
import { ContainerList } from '../../models/container';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { Ripple } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UsersService } from '../../services/users.service';
import { UserOutput } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    PasswordModule,
    DividerModule,
    NgForOf,
    FloatLabelModule,
    CheckboxModule,
    Ripple,
    NgOptimizedImage,
    RouterLink,
    MultiSelectModule,
    JsonPipe,
    NgIf,
    ImageCropperComponent,
  ],
  providers: [StylesService, UsersService, ImageCropperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  stylesList: Style[] = [];
  style?: Style;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  private readonly usersService = inject(UsersService);
  private readonly stylesService = inject(StylesService); //= constructor(private readonly stylesService: RegisterService?) {
  private sanitizer = inject(DomSanitizer); //constructor(private sanitizer: DomSanitizer) {}

  signUpForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    description: new FormControl<string | undefined>('', [
      Validators.maxLength(400),
    ]),
    email: new FormControl<string>('', [
      Validators.email,
      Validators.maxLength(80),
      Validators.required,
    ]),
    location: new FormControl<string | undefined>('', Validators.maxLength(80)),
    styles: new FormControl<Style[]>([]),
    genre: new FormControl(),
    birthday: new FormControl(),
    confirm: new FormControl(false, Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.max(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/),
    ]),
    images: new FormControl<Blob | undefined>(undefined),
  });

  ngOnInit(): void {
    this.getAllStyles();
  }

  onRegister(): void {
    if (this.signUpForm.invalid) {
      console.log('Algo ta mal');
      for (const controlsKey in this.signUpForm.controls) {
        this.signUpForm.get(controlsKey)?.markAsDirty();
        this.signUpForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }

  postUser() {
    this.usersService
      .create(this.signUpForm.getRawValue() as unknown as UserOutput)
      .pipe(take(1))
      .subscribe(value => {
        console.log(value);
      });
  }

  getAllStyles(): Style[] {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data;
      });
    return this.stylesList;
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
      if (event.blob) {
        this.signUpForm.controls['images'].setValue(event.blob);
      }
    }
  }
}
