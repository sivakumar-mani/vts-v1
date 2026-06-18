import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 10;
  locationChosen: boolean = false;
  constructor() {

  }

  ngOnInit(): void {
  }
  onChooseLocation(event: google.maps.MapMouseEvent) {
    this.lat = event.latLng!.lat();
    this.lng = event.latLng!.lng();
    this.locationChosen = true;
  }
}
