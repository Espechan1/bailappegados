import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { StylesService } from '../../services/styles.service';
import { UsersService } from '../../services/users.service';
import { PremisesService } from '../../services/premises.service';
import { EventsService } from '../../services/events.service';
import { LoginDecodeResponse } from '../../models/login-response';
import { Style } from '../../models/style';
import { User } from '../../models/user';
import { Premise } from '../../models/premise';
import { Event as EventCustom } from '../../models/event';
import { take } from 'rxjs';
import { Container, ContainerList } from '../../models/container';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  DatePipe,
  JsonPipe,
  KeyValuePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Ripple } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ImageModule } from 'primeng/image';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DividerModule,
    PasswordModule,
    MultiSelectModule,
    NgIf,
    TabMenuModule,
    TabViewModule,
    TableModule,
    DropdownModule,
    Ripple,
    DialogModule,
    RadioButtonModule,
    ImageModule,
    ImageCropperComponent,
    NgForOf,
    KeyValuePipe,
    JsonPipe,
    DatePipe,
  ],
  providers: [
    StylesService,
    UsersService,
    StateService,
    EventsService,
    PremisesService,
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly stylesService = inject(StylesService);
  private readonly usersService = inject(UsersService);
  private readonly premisesService = inject(PremisesService);
  private readonly eventsService = inject(EventsService);

  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  stylesList: Style[] = [];
  stylesMap: Map<number, string> = new Map<number, string>();
  premisesMap: Map<number, string> = new Map<number, string>();
  myUser!: User;
  selectedStyles?: Style[] = [];
  premisesList?: Premise[] = [];
  rowPremiseinEdit: Record<string, Premise> = {};
  rowEventInEdit: Record<string, EventCustom> = {};
  visibleScheduleModal = false;
  visibleGpsModal = false;
  eventsList?: EventCustom[] = [];
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';

  ngOnInit(): void {
    this.getAllStyles();
    this.getUserById();
    this.getPremises();
    this.getEvents();
    console.log(this.updatePremiseForm.controls);
  }

  //MIS DATOS

  myAccountForm = this.initForm();

  private initForm(user?: User): FormGroup {
    if (!user) {
      return new FormGroup({});
    }
    return new FormGroup({
      name: new FormControl<string | undefined>(user.name, [
        Validators.required,
        Validators.max(50),
        Validators.min(2),
      ]),
      description: new FormControl<string | undefined>(user.description),
      email: new FormControl(user.email, [
        Validators.required,
        Validators.max(50),
        Validators.email,
      ]),
      location: new FormControl<string | undefined>(user.location),
      birthday: new FormControl<Date | undefined>(user.birthday),
      genre: new FormControl(user.genre),
      styles: new FormControl(user.styles, [Validators.min(1)]),
      password: new FormControl<string | undefined>(user.password),
      images: new FormControl<string | Blob | undefined>(
        user.images && user.images?.length > 0 ? user.images[0].url : undefined,
      ),
    });
  }

  getAllStyles(): void {
    this.stylesService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data;
        value.data.forEach(style => this.stylesMap.set(style.id, style.name));
      });
  }

  getUserById() {
    this.usersService
      .getById((this.stateService.token as LoginDecodeResponse).userId)
      .pipe(take(1))
      .subscribe((value: Container<User>) => {
        this.myUser = value.data;
        this.selectedStyles = value.data.styles; //.map(value1 => value1.id);?
        this.myAccountForm = this.initForm(this.myUser);
      });
  }

  modifyUser() {
    this.usersService
      .update(
        this.myAccountForm.getRawValue(),
        (this.stateService.token as LoginDecodeResponse).userId,
      )
      .pipe(take(1))
      .subscribe(value => {
        this.myUser = value.data;
        this.myAccountForm = this.initForm(this.myUser);
      });
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    // Se dispara cuando finaliza el recorte de la imagen. El evento proporciona información sobre la imagen recortada, como su URL y datos en formato base64.
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl,
      );
      if (event.blob) {
        this.myAccountForm.controls['images'].setValue(event.blob);
      }
    }
  }

  deleteUser(): void {
    confirm(
      '¿Estás seguro que quieres borrar tu cuenta? Una vez confirmado, tus datos se borrarán instantáneamente.',
    );
    this.usersService.remove(
      (this.stateService.token as LoginDecodeResponse).userId,
    );
    localStorage.clear();
    this.router.navigate(['/']).then();
  }

  onValidateFormUser(): void {
    if (this.myAccountForm.invalid) {
      for (const controlsKey in this.myAccountForm.controls) {
        this.myAccountForm.get(controlsKey)?.markAsDirty();
        this.myAccountForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }

  //MIS LOCALES
  updatePremiseForm = new FormGroup({
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
    web: new FormControl<string | null>('', Validators.maxLength(50)),
    person_contact: new FormControl<string | null>('', [
      Validators.maxLength(50),
    ]),
    images: new FormControl<Photo[] | null>(null),
    location: new FormGroup({
      lat: new FormControl<number | undefined>(undefined),
      lng: new FormControl<number | undefined>(undefined),
    }),
    schedule: new FormGroup({
      Monday: new FormControl<string | null>(null),
      Tuesday: new FormControl<string | null>(null),
      Wednesday: new FormControl<string | null>(null),
      Thursday: new FormControl<string | null>(null),
      Friday: new FormControl<string | null>(null),
      Saturday: new FormControl<string | null>(null),
      Sunday: new FormControl<string | null>(null),
    }),
  });

  premisesAllowed() {
    return (
      this.stateService.userLogged.isManager ||
      this.stateService.userLogged.isAdmin
    );
  }

  onValidatePremiseForm() {
    if (this.updatePremiseForm.invalid) {
      console.log('Algo del formulario no pasa validación');
      for (const controlsKey in this.updatePremiseForm.controls) {
        this.updatePremiseForm.get(controlsKey)?.markAsDirty();
        this.updatePremiseForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }

  getPremises(): void {
    this.premisesService
      .premisesByUserId((this.stateService.token as LoginDecodeResponse).userId)
      .pipe(take(1))
      .subscribe((value: ContainerList<Premise>) => {
        this.premisesList = value.data;
        value.data.forEach(premise =>
          this.premisesMap.set(premise.id as number, premise.name),
        );
      });
  }

  showDialogSchedule() {
    this.visibleScheduleModal = true;
  }
  onUpdateSchedule() {
    this.visibleScheduleModal = false;
  }

  showDialogGps() {
    this.visibleGpsModal = true;
  }

  onRowEditCancelP(premise: Premise, index: number) {
    if (this.premisesList && this.premisesList[index]) {
      this.premisesList[index] =
        this.rowPremiseinEdit[premise.id?.toString() as string];
      delete this.rowPremiseinEdit[premise.id?.toString() as string];
    }
  }

  onRowEditInitP(premise: Premise) {
    this.rowPremiseinEdit[premise.id?.toString() as string] = { ...premise };
  }

  onRowEditSaveP(premise: Premise) {
    if (premise && premise.id) {
      this.premisesService
        .update(premise, premise.id)
        .pipe(take(1))
        .subscribe(value => {
          if (value.status === 'Success') {
            alert('La modificación ha ido bien');
            if (this.premisesList) {
              const index = this.premisesList.findIndex(
                p => p.id === premise.id, // Encontrar el índice del premise en premisesList y actualizarlo
              );
              if (index !== -1) {
                // Actualizar el objeto premise en la lista
                this.premisesList[index] = { ...premise };
              }
            }
            delete this.rowPremiseinEdit[premise.id?.toString() as string];
          } else {
            alert('Hubo un error al modificar el premise');
          }
        });
    }
  }

  //MIS EVENTOS
  updateEventForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    opening: new FormControl<string | undefined>(''),
    expiration: new FormControl<string | undefined>(''),
    dance_instructors: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    dj: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
    ]),
    price: new FormControl<number | undefined>(undefined, [Validators.min(0)]),
    premise_id: new FormControl<number | undefined>(undefined, [
      Validators.min(1),
      Validators.required,
    ]),
    style_id: new FormControl<number | undefined>(undefined, [
      Validators.min(1),
      Validators.required,
    ]),
    images: new FormControl<string | Blob | undefined>(
      undefined,
      // premise.images && premise.images?.length > 0 ? premise.images[0].url : undefined,
    ),
  });

  getEvents(): void {
    this.eventsService
      .getAll()
      .pipe(take(1))
      .subscribe((value: ContainerList<EventCustom>) => {
        this.eventsList = value.data;
      });
  }

  onRowEditCancelE(event: EventCustom, index: number) {
    if (this.eventsList && this.eventsList[index]) {
      this.eventsList[index] =
        this.rowEventInEdit[event.id?.toString() as string];
      delete this.rowEventInEdit[event.id?.toString() as string];
    }
  }

  onRowEditInitE(event: EventCustom) {
    this.rowEventInEdit[event.id?.toString() as string] = { ...event };
  }

  onRowEditSaveE(event: EventCustom) {
    if (event && event.id) {
      this.eventsService
        .update(event, event.id)
        .pipe(take(1))
        .subscribe(value => {
          if (value.status === 'Success') {
            alert('La modificación ha ido bien');
            if (this.eventsList) {
              const index = this.eventsList.findIndex(
                e => e.id === event.id, // Encontrar el índice del premise en premisesList y actualizarlo
              );
              if (index !== -1) {
                // Actualizar el objeto premise en la lista
                this.eventsList[index] = { ...event };
              }
            }
            delete this.rowEventInEdit[event.id?.toString() as string];
          } else {
            alert('Hubo un error al modificar el premise');
          }
        });
    }
  }

  onValidateEventForm() {
    if (this.updateEventForm.invalid) {
      console.log('Algo del formulario no pasa validación');
      for (const controlsKey in this.updateEventForm.controls) {
        this.updateEventForm.get(controlsKey)?.markAsDirty();
        this.updateEventForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }

  protected readonly Object = Object;
}
