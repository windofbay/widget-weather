import { Component, Input } from '@angular/core';
import { WeatherDetail } from '../weather-detail.model';
import { Lokasi } from '../location.model';

@Component({
  selector: 'app-recent-weather',
  standalone: true,
  imports: [],
  templateUrl: './recent-weather.component.html',
  styleUrl: './recent-weather.component.css'
})
export class RecentWeatherComponent {
  @Input({required:true})todayLocation!:Lokasi;
  @Input({required:true})todayWeather!:WeatherDetail;
}
