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
}