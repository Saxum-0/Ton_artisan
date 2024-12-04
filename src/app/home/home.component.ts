import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Artisan } from '../liste/liste.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',

})

export class HomeComponent {
  location: any = '../assets/location.png';
  favicon: any = '../assets/favicon.png';
  artisans!: Artisan[];
  bestArtisan: any;
  secondArtisan: any;
  thirdArtisan: any;


  constructor(private ApiService: ApiService) {}

  ngOnInit(): void {
    
    //Classement Artisans

    this.ApiService.getArtisans().subscribe((artisans: any[]) => {
      artisans.sort((a, b) => b.note - a.note);
      this.bestArtisan = artisans[0];
      this.secondArtisan = artisans[1];
      this.thirdArtisan = artisans[2];
    });
  }}