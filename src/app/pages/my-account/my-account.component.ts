import { Component, inject, Injectable, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Style } from '../../models/style';
import { UsersService } from '../../services/users.service';
import { StylesService } from '../../services/styles.service';
import { StateService } from '../../services/state.service';
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
import { NgIf } from '@angular/common';
import { LoginDecodeResponse } from '../../models/login-response';

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
  ],
  providers: [StylesService, UsersService, StateService],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
@Injectable()
export class MyAccountComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly stylesService = inject(StylesService);
  private readonly stateService = inject(StateService);

  stylesList: Style[] = [];
  style?: Style;
  myUser!: User;
  selectedStyles?: Style[] = [];

  myAccountForm = this.initForm();

  private initForm(user?: User): FormGroup {
    if (!user) {
      //si el usuario no está definido
      return new FormGroup({});
    }
    return new FormGroup({
      name: new FormControl(user.name, [
        Validators.required,
        Validators.max(80),
        Validators.min(2),
      ]),
      description: new FormControl(user.description),
      email: new FormControl(user.email, [
        Validators.required,
        Validators.max(80),
        Validators.email,
      ]),
      location: new FormControl(user.location),
      birthday: new FormControl(user.birthday),
      genre: new FormControl(user.genre),
      styles: new FormControl(user.styles, [Validators.min(1)]),
      password: new FormControl(user.password, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/),
      ]),
    });
  }

  ngOnInit(): void {
    this.getAllStyles();
    this.getUserById();
  }

  getAllStyles(): void {
    //Todos los estilos por los botones de opciones
    this.stylesService
      .getStyles()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data;
      });
  }

  getUserById() {
    // Consulta datos del usuario
    console.log(this.stateService.token);
    this.usersService
      .getById((this.stateService.token as LoginDecodeResponse).userId)
      .pipe(take(1))
      .subscribe((value: Container<User>) => {
        this.myUser = value.data;
        console.log(this.myUser, value.data);
        this.selectedStyles = value.data.styles; //.map(value1 => value1.id);
        console.log(this.selectedStyles, value.data.styles);
        this.myAccountForm = this.initForm(this.myUser);
      });
  }

  onUpdateUser(): void {
    if (this.myAccountForm.invalid) {
      console.log('Algo del formulario no pasa validación');
      for (const controlsKey in this.myAccountForm.controls) {
        this.myAccountForm.get(controlsKey)?.markAsDirty();
        this.myAccountForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    console.log('funciono');
  }
}
