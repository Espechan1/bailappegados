import { Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, Button, TabMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);

  items: MenuItem[] = [
    // { id: 'main', label: 'Inicio', routerLink: '/', styleClass: 'styleTab2' },
    { id: 'events', label: 'Eventos', routerLink: '/events' },
    { id: 'classrooms', label: 'Clases', routerLink: '/classrooms' },
    { id: 'premises', label: 'Locales', routerLink: '/premises' },
    { id: 'account#logged', label: 'Mi cuenta', routerLink: '/my-account' },
    { id: 'logout#logged', label: 'Logout', routerLink: '/logout' },
    { id: 'login#loggin', label: 'Login', routerLink: '/login' },
    { id: 'signup#loggin', label: 'Registro', routerLink: '/register' },
  ];

  private readonly menuVisible = {
    //obj de dos propiedades, los items id públicos y los de logueado. Define la visibilidad de los items.
    login: this.items
      .filter(value => value.id?.includes('#logged')) //logado user
      .map(value => value.id),
    logout: this.items
      .filter(value => value.id?.includes('#loggin')) //sin logar
      .map(value => value.id),
  };

  ngOnInit(): void {
    // this.controlRolMenu();
    this.router.events.subscribe(() => {
      this.controlRolMenu();
    });
  }

  private controlRolMenu() {
    this.items.forEach(value => {
      if (this.menuVisible.login.includes(value.id)) {
        value.visible = !!localStorage.getItem('token');
      } else if (this.menuVisible.logout.includes(value.id)) {
        value.visible = localStorage.getItem('token') === null;
      }
    });
  }

  onIndex() {
    this.router.navigate(['']).then();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onIndex();
    }
  }
}
