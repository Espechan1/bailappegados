import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appBrokenImage]',
  standalone: true,
})
export class BrokenImageDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}
  @Input() urlCustom?: string; // --> Esto luego será otra propiedad en img [urlCustom]='string, enlace que le pase.'
  ngOnInit() {
    const img = this.elementRef.nativeElement;
    console.log(img); //Trae las img a la consola.
  }
  @HostListener('error')
  initImgDefault() {
    //cargar img x defecto
    console.log('Esta img está rota', this.elementRef.nativeElement); // Muestra solo los rotos
    //Cuando entre la función de error qué quiero hacer?
    const element = this.elementRef.nativeElement;
    element.src =
      this.urlCustom ||
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
  }
}
