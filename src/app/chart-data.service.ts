
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private _jsonURL = '/assets/data.json';

    constructor(private http:HttpClient) { }     
    getChartData() {
        return this.http.get(this._jsonURL);
    }
          
}