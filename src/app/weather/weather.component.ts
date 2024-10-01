import { Component, inject, OnInit } from '@angular/core';
import { RecentWeatherComponent } from './recent-weather/recent-weather.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { WeatherService } from './weather.service';
import { WeatherDetail } from './weather-detail.model';
import { Lokasi } from './location.model';
import { MapsComponent } from "./maps/maps.component";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [RecentWeatherComponent, ForecastsComponent, MapsComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  response?:any;
  constructor() { }
  todayWeather?:WeatherDetail;
  todayWeathers?:WeatherDetail[];
  todayLocation?:Lokasi;
  ngOnInit(): void {
    this.weatherService.getWeather().subscribe((res)=>{
      this.response=res.data[0];
      this.todayWeathers = this.response.cuaca[0];
      this.todayLocation = this.response.lokasi;
    });
    this.setTodayWeather();
  }
  setTodayWeather(){
    let hours:number[] = [];
    this.todayWeathers!.forEach(w => {
      hours.push(new Date(w.local_datetime).getHours());
    })
    const currentHour =  new Date().getHours();
    const weather = this.todayWeathers!.find(
      weather=> new Date(weather.local_datetime).getHours()  === this.floorToClosestNumber(currentHour,hours) 
    );  
    this.todayWeather = weather;
  }
  private floorToClosestNumber(input: number, numbers: number[]): number | undefined {
    // Filter the array to find all numbers less than or equal to the input
    const possibleNumbers = numbers.filter(num => num <= input);
    // Return the maximum of the filtered numbers, or undefined if no such number exists
    return Math.max(...possibleNumbers);
}
}
