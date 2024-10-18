import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-contact',
  standalone: true,
    imports: [

    ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contactForm = new FormGroup({
    name: new FormControl(),
    surname: new FormControl(),
    email: new FormControl(Validators.required, Validators.email),
    phoneNumber: new FormControl(),
    message: new FormControl('',[Validators.required]),
  })

  onContact():void{
    if(this.contactForm.invalid){
      console.log("Algo ta mal")
      for (let controlsKey in this.contactForm.controls) {
        this.contactForm.get(controlsKey)?.markAsDirty()
        this.contactForm.get(controlsKey)?.updateValueAndValidity()
      }
      return
    }
    console.log("funciono")
  }

}
