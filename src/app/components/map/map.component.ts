import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { icon, Layer, Marker } from 'leaflet';
import { Gps } from '../../models/premise';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  map!: Leaflet.Map;
  // private map;
  @Output() handleMapClick = new EventEmitter<Gps>();

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [39.5984, 2.6616],
      zoom: 11.6,
    });
    const tiles = Leaflet.tileLayer(
      //capa puzzle
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );

    const iconRetinaUrl = 'marker-icon-2x.png';
    const iconUrl = 'marker-icon.png';
    const shadowUrl = 'marker-shadow.png';
    Marker.prototype.options.icon = icon({
      //Plantilla del marcador
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    let marker: Layer; //Creo un marcador
    this.map.on('click', e => {
      //Solo permite un marcador
      if (marker) this.map.removeLayer(marker);
      marker = Leaflet.marker([e.latlng.lat, e.latlng.lng]); //Crea el nuevo
      this.map.addLayer(marker); //Lo añade en el mapa
      this.handleMapClick.emit({ lat: e.latlng.lat, lon: e.latlng.lng });
    });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
