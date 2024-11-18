import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, InputTextareaModule, Button],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm = new FormGroup({
    name: new FormControl(),
    surname: new FormControl(),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(),
    message: new FormControl('', [Validators.required]),
  });

  onContact(): void {
    if (this.contactForm.invalid) {
      console.log('Algo ta mal');
      for (const controlsKey in this.contactForm.controls) {
        this.contactForm.get(controlsKey)?.markAsDirty();
        this.contactForm.get(controlsKey)?.updateValueAndValidity();
      }
      return;
    }
    //   if (this.contactForm.valid) {
    //     const formData = this.contactForm.value;
    //
    //     this.http.post('/api/send-email', formData)
    //       .subscribe(
    //         response => {
    //           console.log('Correo enviado:', response);
    //           // Mostrar mensaje de éxito al usuario
    //         },
    //         error => {
    //           console.error('Error al enviar el correo:', error);
    //           // Mostrar mensaje de error al usuario
    //         }
    //       );
    //   }
    // }

    console.log('funciono');
  }
}
