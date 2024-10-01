import { AfterViewInit, Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Marker } from './marker.model';
import { WeatherService } from '../weather.service';


@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [GoogleMapsModule,GoogleMap,ReactiveFormsModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit,AfterViewInit{
  weatherService = inject(WeatherService);
  constructor(private ngZone: NgZone) {};
  center: google.maps.LatLngLiteral = { lat: -6.200000, lng: 106.816666 };
  zoom=10;
  markers: Marker[] = [];
  // @ViewChild('search')
  // searchElementRef!: ElementRef;
  // @ViewChild(GoogleMap)
  // map!: GoogleMap;
  latitude!: any;
  longitude!: any;

  form = new FormGroup({
    latitude: new FormControl<string>(''),
    longitude: new FormControl<string>(''),
  });
  moveToLocation() {
    this.center = { lat: parseFloat(this.form.value.latitude!), lng: parseFloat(this.form.value.longitude!)};
    console.log(this.center);
    
  }
  convertToElement(iconUrl: string) {
    const glyphImg = document.createElement('img');
    glyphImg.src = iconUrl;
    glyphImg.width = 30;

    const glyphSvgPinElement = new google.maps.marker.PinElement({
        glyph: glyphImg,
    });
    glyphSvgPinElement.scale = 0.1
    return glyphSvgPinElement;
  }
  addMarker(latitude: number, longitude: number, icon: string) {
    const marker: Marker = {
      position: { lat: latitude, lng: longitude },
      iconUrl: this.convertToElement(icon),
    };
    this.markers.push(marker);
  }
  ngOnInit(): void {
  this.weatherService.getWeatherByLocation('31.71').then((res)=>{
      res.subscribe((res)=>{
        this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,res.data[0].cuaca[0][0].image);
      })
    })
    this.weatherService.getWeatherByLocation('31.75').then((res)=>{
      res.subscribe((res)=>{
        this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,res.data[0].cuaca[0][0].image);
      })
    })
    this.weatherService.getWeatherByLocation('31.73').then((res)=>{
      res.subscribe((res)=>{
        this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,res.data[0].cuaca[0][0].image);
      })
    })
    console.log(this.markers);
    
  }
  // async ngOnInit(): Promise<void> {
  // this.weatherService.getWeatherByLocation('31.71').then((res)=>{
  //     res.subscribe((res)=>{
  //       console.log(res.data[0]);
  //     })
  //   })
  //   this.weatherService.getWeatherByLocation('31.75').then((res)=>{
  //     res.subscribe((res)=>{
  //       console.log(res.data[0]);
  //     })
  //   })
  //   this.weatherService.getWeatherByLocation('31.73').then((res)=>{
  //     res.subscribe((res)=>{
  //       console.log(res.data[0]);
  //     })
  //   })
  // }
  ngAfterViewInit(): void {
    
    // // Binding autocomplete to search input control
    // let autocomplete = new google.maps.places.Autocomplete(
    //   this.searchElementRef.nativeElement
    // );
    // // Align search box to center
    // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //   this.searchElementRef.nativeElement
    // );
    // autocomplete.addListener('place_changed', () => {
    //   this.ngZone.run(() => {
    //     //get the place result
    //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //     //verify result
    //     if (place.geometry === undefined || place.geometry === null) {
    //       return;
    //     }

    //     console.log({ place }, place.geometry.location?.lat());

    //     //set latitude, longitude and zoom
    //     this.latitude = place.geometry.location?.lat();
    //     this.longitude = place.geometry.location?.lng();
    //     this.center = {
    //       lat: this.latitude,
    //       lng: this.longitude,
    //     };
    //     this.zoom = 20;
    //   });
    // });
  }


}
