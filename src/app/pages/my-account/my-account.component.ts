import {Component, inject, Injectable, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {Style} from '../../models/style';
import {UsersService} from '../../services/users.service';
import {StylesService} from '../../services/styles.service';
import {StateServiceService} from '../../services/state-service.service';
import {take} from 'rxjs';
import {Container, ContainerList} from '../../models/container';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {DividerModule} from 'primeng/divider';
import {PasswordModule} from 'primeng/password';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgIf} from '@angular/common';

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
    NgIf
  ],
  providers: [StylesService, UsersService, StateServiceService],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})

@Injectable()
export class MyAccountComponent implements OnInit{

  private readonly usersService = inject(UsersService);
  private readonly stylesService = inject(StylesService);
  private readonly stateService = inject(StateServiceService);

  stylesList: Style[]=[];
  style?: Style;
  myUser!: User;

  ngOnInit(): void {
    this.getAllStyles()
  }

  getAllStyles(): void { //Todos los estilos por los botones de opciones
    this.stylesService.getStyles()
      .pipe(take(1))
      .subscribe((value: ContainerList<Style>) => {
        this.stylesList = value.data
        console.log(this.stylesList, value)
      })
  }

  getUserById() { // Consulta datos del usuario
    this.usersService.getById(this.stateService.token.user)
      .pipe(take(1))
      .subscribe((value: Container<User>) => {
        this.myUser = value.data
      })
  }

  myAccountForm = new FormGroup({
    name: new FormControl(this.myUser.name, [Validators.required, Validators.max(100), Validators.min(2)]),
    description: new FormControl(this.myUser.description),
    email: new FormControl(this.myUser.email, [Validators.required, Validators.max(80),Validators.email]),
    location: new FormControl(this.myUser.location),
    birthday: new FormControl(this.myUser.birthday),
    genre: new FormControl(this.myUser.genre),
    password: new FormControl(this.myUser.password, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/)]),
  });

  onUpdateUser():void{
    if(this.myAccountForm.invalid){
      console.log("Algo del formulario no pasa validación")
      for (let controlsKey in this.myAccountForm.controls) {
        this.myAccountForm.get(controlsKey)?.markAsDirty()
        this.myAccountForm.get(controlsKey)?.updateValueAndValidity()
      }
      return
    }
    console.log("funciono")
  }

}



