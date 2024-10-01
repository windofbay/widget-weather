import { Component, inject, Input, input } from '@angular/core';
import { WeatherForecast } from '../weather-forecast.model';
import { WeatherDetail } from '../weather-detail.model';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecasts',
  standalone: true,
  imports: [],
  templateUrl: './forecasts.component.html',
  styleUrl: './forecasts.component.css'
})
export class ForecastsComponent {
  private weatherService = inject(WeatherService);
  @Input({required:true})forecasts!:WeatherDetail[];

  getTime(datetime:string):string{
    return this.weatherService.getTime(datetime);
  }
}
