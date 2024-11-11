import {Component, inject, OnInit} from '@angular/core';
import {Style} from '../../models/style';
import {StylesService} from '../../services/styles.service';
import {JsonPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {take} from 'rxjs';
import {ContainerList} from '../../models/container';
import {RouterLink} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {PasswordModule} from 'primeng/password';
import {DividerModule} from 'primeng/divider';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CheckboxModule} from 'primeng/checkbox';
import {Ripple} from 'primeng/ripple';
import {MultiSelectModule} from 'primeng/multiselect';
import {ImageCroppedEvent, ImageCropperComponent, LoadedImage} from 'ngx-image-cropper';
import {SafeUrl} from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import {FileUploadModule} from 'primeng/fileupload';

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
    FileUploadModule
  ],
  providers: [StylesService, ImageCropperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{ //

  stylesList: Style[]=[];
  style?: Style;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl  = '';

  private readonly stylesService = inject(StylesService); //= constructor(private readonly stylesService: RegisterService?) {

  constructor(private sanitizer: DomSanitizer) {}

  signUpForm = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    description: new FormControl(),
    email: new FormControl('', [Validators.email, Validators.required]),
    location: new FormControl(),
    styles: new FormControl(),
    genre: new FormControl(),
    birthday: new FormControl(),
    confirm: new FormControl(false, Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.max(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/)])
  })

  ngOnInit(): void {
    this.getAllStyles()
  }

  readonly  genders = [{
    key: 'H',
    name: 'Hombre',
  }, {
    key: 'F',
    name: 'Mujer',
  }, {
    key: 'O',
    name: 'Otros',
  }];

  onRegister():void{
    if(this.signUpForm.invalid){
      console.log("Algo ta mal")
      for (let controlsKey in this.signUpForm.controls) {
        this.signUpForm.get(controlsKey)?.markAsDirty()
        this.signUpForm.get(controlsKey)?.updateValueAndValidity()
      }
      return
    }
    console.log("funciono")
  }

  getAllStyles(): Style[] {
    this.stylesService.getStyles()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data
        console.log(this.stylesList) //Array de obj, hay que quitar created_at
        console.log( value);
      });
    return this.stylesList;
  }

  // fileChangeEvent(event: Event): void {
  //   this.imageChangedEvent = event;
  // }
  //
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  //   // event.blob can be used to upload the cropped image
  // }
  //
  // imageLoaded(image: LoadedImage) {
  //   // show cropper
  // }
  // cropperReady() {
  //   // cropper ready
  // }
  // loadImageFailed() {
  //   // show message
  // }

  // getById(id: number) {
  //   this.stylesService.getById(id)
  //     .pipe(take(1))
  //     .subscribe((value: Container<Style>) => {
  //       this.style = value.data
  //     })
  // }



}
