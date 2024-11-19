import { AfterViewInit, Component, ElementRef, Inject, inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { Marker } from './marker.model';
import { WeatherService } from '../weather.service';
import { WeatherDetail } from '../weather-detail.model';
import { Region } from '../province.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import * as L from 'leaflet';
import { isPlatformBrowser } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit,AfterViewInit{
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  weatherService = inject(WeatherService);
  zoom=10;
  provinces: Region[] = [];
  //marker: L.Marker | undefined;
  cities:Region[]=[];
  districts:Region[]=[];
  todayWeather?:WeatherDetail;
  @ViewChild('selectProvince')inputProvince!:ElementRef<HTMLSelectElement>;
  @ViewChild('selectCity') inputCity!:ElementRef<HTMLSelectElement>;
  latitude!: any;
  longitude!: any;
  options: any;
  form = new FormGroup({
    province: new FormControl<string>(''),
    city: new FormControl<string>(''),
  });
  moveToLocation() {
      this.weatherService.getWeatherByCity(this.inputCity.nativeElement.value).then((res)=>{
        res.subscribe((res)=>{
          let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
          let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
          console.log(todayWeather);
          //this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,todayWeather.image);
          //this.center = { lat: parseFloat(res.data[0].lokasi.lat), lng: parseFloat(res.data[0].lokasi.lon)};
        })
      })
  }
  // convertToElement(iconUrl: string) {
  //   const glyphImg = document.createElement('img');
  //   glyphImg.src = iconUrl;
  //   glyphImg.width = 30;
  //   const glyphSvgPinElement = new google.maps.marker.PinElement({
  //       glyph: glyphImg,
  //   });
  //   glyphSvgPinElement.scale = 0.1
  //   return glyphSvgPinElement;
  // }
  // addMarker(latitude: number, longitude: number, icon: string) {
  //   const marker = L.icon({
  //     iconUrl:"https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-am.svg",
  //     iconSize:     [38, 95], // size of the icon
  //     shadowSize:   [50, 64], // size of the shadow
  //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  //     shadowAnchor: [4, 62],  // the same for the shadow
  //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  //   })
  //   // if (typeof window !== 'undefined') {
  //   //   import('leaflet').then(L => {
  //   //     const map = L.map('map').setView([latitude, longitude], 13);
  //   //     L.marker([latitude, longitude],{icon:marker}).addTo(map);
  //   //     marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  //   //   });
  //   // }
  
  // }
  setTodayWeather(todayWeathers:WeatherDetail[]):WeatherDetail {
    let hours:number[] = [];
    todayWeathers.forEach(w => {
      hours.push(new Date(w.local_datetime).getHours());
    })
    const currentHour =  new Date().getHours();
    const weather = todayWeathers.find(
      weather=> new Date(weather.local_datetime).getHours()  === this.weatherService.floorToClosestNumber(currentHour,hours) 
    );  
    return weather!;
  }
  
  ngOnInit(): void {

    this.weatherService.getProvinces().subscribe((res)=>{
      this.provinces = res.data;
    })

    this.form.controls.province.valueChanges.pipe(
      debounceTime(500), 
      distinctUntilChanged(), 
    ).subscribe(
      ()=>{
        this.weatherService.getCities(this.inputProvince.nativeElement.value)
        .subscribe((res)=>{
          this.cities = res.data;
        });
      }
    )    

  }
  map:any;
  ngAfterViewInit(): void {
    //this.generateMaps(-6.1760722354, 106.7738516473);
  }
  // generateMaps(lat:number,long:number) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     import('leaflet').then(L => {
  //       const map = L.map('map').setView([lat, long], 13);
  //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         attribution: '© OpenStreetMap contributors'
  //       }).addTo(map);
  //     });
  //   }
  // }
}



    // this.weatherService.getWeatherByCity('31.71').then((res)=>{
    //     res.subscribe((res)=>{
    //       let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
    //       let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
    //       this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,todayWeather.image);
    //     })
    //   })
    //   this.weatherService.getWeatherByCity('31.75').then((res)=>{
    //     res.subscribe((res)=>{
    //       let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
    //       let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
    //       this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,todayWeather.image);
    //     })
    //   })
    //   this.weatherService.getWeatherByCity('31.73').then((res)=>{
    //     res.subscribe((res)=>{
    //       let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
    //       let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
    //       this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,todayWeather.image);
    //     })
    //   })
    //   this.weatherService.getWeatherByVillage('32.01.05').then((res)=>{
    //     res.subscribe((res)=>{
    //       let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
    //       let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
    //       this.addMarker(res.data[0].lokasi.lat,res.data[0].lokasi.lon,todayWeather.image);
    //     })
    //   })
      //console.log(this.markers);