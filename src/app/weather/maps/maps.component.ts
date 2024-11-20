import { AfterViewInit, Component, ElementRef, Inject, inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { Marker } from './marker.model';
import { WeatherService } from '../weather.service';
import { WeatherDetail } from '../weather-detail.model';
import { Region } from '../province.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit{
  weatherService = inject(WeatherService);
  zoom=10;
  provinces: Region[] = [];
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
  map:Map | undefined;
  
  moveToLocation() {
      this.weatherService.getWeatherByCity(this.inputCity.nativeElement.value).then((res)=>{
        res.subscribe((res)=>{
          let todayWeathers:WeatherDetail[]=res.data[0].cuaca[0];
          let location = res.data[0].lokasi;
          console.log(location);
          let todayWeather : WeatherDetail = this.setTodayWeather(todayWeathers)
          console.log(todayWeather);
          
          const view = this.map!.getView();
          view.animate({
            center: fromLonLat([location.lon, location.lat]),
            zoom: this.zoom,
            duration: 500, // Optional: animation duration in milliseconds
          });
          this.addMarkers([
            {long : location.lon, lat: location.lat, weather: todayWeather.weather_desc_en}
          ]);
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
    this.initMap(106.7738516473, -6.1760722354);
  }
  initMap(long: number, lat: number) {
    // Initialize the map
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([long, lat]),
        zoom: 10
      })
    });
  
    // Add a marker
    this.addMarkers([
      { long: long, lat: lat, weather:"Sunny" }
    ]);
  }
  locations : { long: number; lat: number }[] = [];
  addMarkers(locations: { long: number; lat: number; weather:string }[]) {
    const features = locations.map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.long, location.lat]))
      });
  
      // Set the style for the marker
      feature.setStyle(
        new Style({
          image: new Icon({
            src: this.weatherService.getWeatherIcon(location.weather), // Marker icon URL
            scale: 0.3 // Adjust the size of the icon
          })
        })
      );
  
      return feature;
    });
  
    // Create a vector source and layer for the markers
    const markerSource = new VectorSource({
      features: features
    });
  
    const markerLayer = new VectorLayer({
      source: markerSource
    });
  
    // Add the marker layer to the map
    this.map?.addLayer(markerLayer);
  }
  
  
  
}