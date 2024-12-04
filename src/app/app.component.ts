import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { RechercheService } from './recherche.service';
import { Router, RouterOutlet } from '@angular/router';
import { Artisan } from './liste/liste.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
 
  
})
export class AppComponent {
  title = 'Trouve ton Artisan';
  sortedArtisans!: Artisan[];
  artisans!: Artisan[];


  constructor(
    private router: Router,
    private ApiService: ApiService,
    private RechercheService: RechercheService,
    private sanitizer: DomSanitizer,
  ) {
    this.ApiService.getArtisans().subscribe((artisans) => {
      this.artisans = artisans;
      this.sortedArtisans = [...this.artisans];
    });
  }
}





