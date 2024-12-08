import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [Button],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  private router = inject(Router);

  cleanLocalStorage() {
    localStorage.clear();
    alert('Cerrada sesión correctamente');
    this.router.navigate(['/']).then();
  }
}
