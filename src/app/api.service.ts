import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artisan } from './liste/liste.component';


@Injectable({
  providedIn: 'root'
})

   export class ApiService {
    private apiUrl = '/data/datas.json';
  
    constructor(private http: HttpClient) {}
  
    getArtisans(): Observable<Artisan[]> {
      return this.http.get<Artisan[]>(`${this.apiUrl}`);
    }
  }
  