import { inject, Injectable } from '@angular/core';
import { environment } from '../app.config';
import { catchError, Observable } from 'rxjs';
import { Weather } from './weather.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }
  private apiUrl = environment.apiUrl;
  private placesUrl = environment.placesUrl;

  private http = inject(HttpClient);
  
  getWeather():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}?adm4=31.73.05.1005`)
    .pipe(
      catchError((err)=>{throw new Error(err)})
    );
  }
  async getWeatherByCity(location:string):Promise<Observable<any>>{
    return await this.http.get<any>(`${this.apiUrl}?adm2=${location}`)
  }
  async getWeatherByVillage(location:string):Promise<Observable<any>>{
    return await this.http.get<any>(`${this.apiUrl}?adm3=${location}`)
  }
  getProvinces():Observable<any>{
    return this.http.get<any>(`${this.placesUrl}/provinces.json`)
  }
  getCities(provinceCode:string):Observable<any>{
    return this.http.get<any>(`${this.placesUrl}/regencies/${provinceCode}.json`)
  }
  getTime(datetime:string):string{
    // Create a Date object with the specified time
    const specificTime = new Date(datetime);

    // Get the hour and minute
    const hours = specificTime.getHours();   // 7
    const minutes = specificTime.getMinutes(); // 0

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return formattedTime // Output: 07:00

  }
  getWeatherIcon(condition: string): string {
    const weatherIcons:Map<string,string> = new Map();
    weatherIcons.set("Sunny","https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-am.svg");
    weatherIcons.set("Mostly Cloudy","https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg");  
    weatherIcons.set("Light Rain","https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan sedang-am.svg");  
    weatherIcons.set("Moderate Rain","https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan sedang-am.svg");  
    weatherIcons.set("Partly Cloudy","https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah berawan-am.svg");  
    return weatherIcons.get(condition)!;
  }
  floorToClosestNumber(input: number, numbers: number[]): number | undefined {
    // Filter the array to find all numbers less than or equal to the input
    const possibleNumbers = numbers.filter(num => num <= input);
    // Return the maximum of the filtered numbers, or undefined if no such number exists
    return Math.max(...possibleNumbers);
  }
}
