import { WeatherDetail } from "./weather-detail.model";
import { WeatherForecast } from "./weather-forecast.model";

export interface Weather {
    lokasi:Location;
    cuaca:WeatherForecast[];
}