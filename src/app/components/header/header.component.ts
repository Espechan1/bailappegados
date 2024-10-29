import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    Button,
    TabMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] = [
    {id: "main", label: 'Inicio', routerLink: '/', styleClass: 'styleTab2'},
    {id: "events", label: 'Eventos', routerLink: '/events'},
    {id: "premises", label: 'Locales', routerLink: '/premises'},
    {id: "account#logged", label: 'Mi cuenta', routerLink: '/my-account'},
    {id: "logout#logged", label: 'Logout', routerLink: '/logout'},
    {id: "login#loggin", label: 'Login', routerLink: '/login',},
    {id: "signup#loggin",label: 'Register', routerLink: '/register'}
  ];

  private readonly menuVisible = { //obj de dos propiedades, los itemsid públicos y los de logueado.
    login: this.items.filter(value => value.id?.includes('#logged')).map(value => value.id),
    logout: this.items.filter(value => value.id?.includes('#loggin')).map(value => value.id),
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined'){
      this.items.forEach(value => {
        if(this.menuVisible.login.includes(value.id)){
          value.visible = !!sessionStorage.getItem('token')
        } else if(this.menuVisible.logout.includes(value.id)){
          value.visible = sessionStorage.getItem('token') === null;
        }
      })
    }
    /**
     * (this.items.find(value => value.label === 'Login') as MenuItem).visible = !!sessionStorage?.getItem('token');
     * Si consigue el token(devuelve un string y será parseado a true), visible es falso y no muestra 'Login'.*/
    // private readonly platformId = inject(PLATFORM_ID);
    // if (isPlatformBrowser(this.platformId)) {
    //   if(typeof sessionStorage.getItem('token') === 'string'){ //getItem devuelve un string si hay token o un null sino.
    //     (this.items.find(value => value.label === 'Login') as MenuItem).visible = false;
    //     (this.items.find(value => value.label === 'Register') as MenuItem).visible = false;
    //     (this.items.find(value => value.label === 'Logout') as MenuItem).visible = true;
    //   } else {
    //     (this.items.find(value => value.label === 'Logout') as MenuItem).visible = false;
    //   }
    // }
    // if (isPlatformBrowser(this.platformId)) {
    //   (this.items.find(value => value.label === 'Login') as MenuItem).visible = !!sessionStorage?.getItem('token');
    //   (this.items.find(value => value.label === 'Register') as MenuItem).visible = !!sessionStorage?.getItem('token');
    //   (this.items.find(value => value.label === 'Logout') as MenuItem).visible = true;
    //   (this.items.find(value => value.label === 'Logout') as MenuItem).visible = true;
    // }
  }
}

