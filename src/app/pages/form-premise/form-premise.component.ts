import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-form-premise',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './form-premise.component.html',
  styleUrl: './form-premise.component.css'
})
export class FormPremiseComponent {

  createPremiseForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', Validators.required),
    schedule: new FormControl(''),
    phone_number: new FormControl('', [Validators.required, Validators.maxLength(13)]),
    web: new FormControl('', Validators.maxLength(50)),
    person_contact: new FormControl('', Validators.maxLength(50)),
    image: new FormControl(),
    location: new FormControl('')
  })

  onCreate(){

  }

}
