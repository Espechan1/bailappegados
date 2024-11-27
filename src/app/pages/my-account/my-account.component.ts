// import { Component, inject, OnInit } from '@angular/core';
// import { StateService } from '../../services/state.service';
// import { StylesService } from '../../services/styles.service';
// import { UsersService } from '../../services/users.service';
// import { PremisesService } from '../../services/premises.service';
// import { EventsService } from '../../services/events.service';
// import { LoginDecodeResponse } from '../../models/login-response';
// import { Style } from '../../models/style';
// import { User } from '../../models/user';
// import { Premise } from '../../models/premise';
// import { take } from 'rxjs';
// import { Container, ContainerList } from '../../models/container';
// import { Router } from '@angular/router';
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { InputTextModule } from 'primeng/inputtext';
// import { CalendarModule } from 'primeng/calendar';
// import { DividerModule } from 'primeng/divider';
// import { PasswordModule } from 'primeng/password';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { NgIf } from '@angular/common';
// import { TabMenuModule } from 'primeng/tabmenu';
// import { TabViewModule } from 'primeng/tabview';
// import {ToastModule} from 'primeng/toast';
// import {TableModule} from 'primeng/table';
// import {DropdownModule} from 'primeng/dropdown';
// import {Ripple} from 'primeng/ripple';
//
// @Component({
//   selector: 'app-my-account',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     InputTextModule,
//     CalendarModule,
//     DividerModule,
//     PasswordModule,
//     MultiSelectModule,
//     NgIf,
//     TabMenuModule,
//     TabViewModule,
//     ToastModule,
//     TableModule,
//     DropdownModule,
//     Ripple,
//   ],
//   providers: [StylesService, UsersService, StateService, EventsService, PremisesService],
//   templateUrl: './my-account.component.html',
//   styleUrl: './my-account.component.css',
// })
// export class MyAccountComponent implements OnInit {
//   private readonly stateService = inject(StateService);
//   private readonly stylesService = inject(StylesService);
//   private readonly usersService = inject(UsersService);
//   private readonly premisesService = inject(PremisesService);
//   private readonly eventsService = inject(EventsService);
//   private router = inject(Router);
//
//   stylesList: Style[] = [];
//   style?: Style;
//   myUser!: User;
//   selectedStyles?: Style[] = [];
//   premisesList?: Premise[] = [];
//   eventsList?: Event[] = [];
//
//   ngOnInit(): void {
//     this.getAllStyles();
//     this.getUserById();
//     this.getPremises();
//     this.getEvents();
//   }
//
//   getPremises(): void {
//     this.premisesService
//       .getAll()
//       .pipe(take(1))
//       .subscribe((value: ContainerList<Premise>) => {
//         this.premisesList = value.data;
//       });
//   }
//
//   getEvents(): void {
//     this.eventsService
//       .getAll()
//       .pipe(take(1))
//       .subscribe((value: ContainerList<Event>) => {
//         this.eventsList = value.data;
//       });
//   }
//
//   myAccountForm = this.initForm();
//
//   private initForm(user?: User): FormGroup {
//     if (!user) {
//       //si el usuario no está definido
//       return new FormGroup({});
//     }
//     return new FormGroup({
//       name: new FormControl(user.name, [
//         Validators.required,
//         Validators.max(50),
//         Validators.min(2),
//       ]),
//       description: new FormControl(user.description),
//       email: new FormControl(user.email, [
//         Validators.required,
//         Validators.max(50),
//         Validators.email,
//       ]),
//       location: new FormControl(user.location),
//       birthday: new FormControl(user.birthday),
//       genre: new FormControl(user.genre),
//       styles: new FormControl(user.styles, [Validators.min(1)]),
//       password: new FormControl(user.password, [
//         Validators.required,
//         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/),
//       ]),
//     });
//   }
//
//   getAllStyles(): void {
//     this.stylesService
//       .getAll()
//       .pipe(take(1))
//       .subscribe((value: ContainerList<Style>) => {
//         this.stylesList = value.data;
//       });
//   }
//
//   getUserById() {
//     this.usersService
//       .getById((this.stateService.token as LoginDecodeResponse).userId)
//       .pipe(take(1))
//       .subscribe((value: Container<User>) => {
//         this.myUser = value.data;
//         this.selectedStyles = value.data.styles; //.map(value1 => value1.id);?
//         this.myAccountForm = this.initForm(this.myUser);
//       });
//   }
//
//   modifyUser() {
//     this.usersService
//       .update(
//         this.myAccountForm.getRawValue(),
//         (this.stateService.token as LoginDecodeResponse).userId,
//       )
//       .pipe(take(1))
//       .subscribe(value => {
//         this.myUser = value.data;
//         this.myAccountForm = this.initForm(this.myUser);
//       });
//   }
//
//   onUpdateUser(): void {
//     if (this.myAccountForm.invalid) {
//       console.log('Algo del formulario no pasa validación');
//       for (const controlsKey in this.myAccountForm.controls) {
//         this.myAccountForm.get(controlsKey)?.markAsDirty();
//         this.myAccountForm.get(controlsKey)?.updateValueAndValidity();
//       }
//       return;
//     }
//     console.log('funciono');
//   }
//
//   deleteUser(): void {
//     confirm(
//       '¿Estás seguro que quieres borrar tu cuenta? Una vez confirmado, tendrás que crearte una cuenta nueva.',
//     );
//     this.usersService.remove(
//       (this.stateService.token as LoginDecodeResponse).userId);
//       localStorage.clear();
//       this.router.navigate(["/"]).then();
//   }
// }
