import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RechercheService } from '../recherche.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
 
})
export class ListeComponent implements OnInit{



  favicon: any = 'favicon.png';
  @Input() id: number = 0;
  artisans!: Artisan[];
  sortedArtisans!: Artisan[];
  selectedCategory: string = '';
  searchTerm: string = '';
  category!: string;
  private searchSubscription: Subscription;
  artisan: Artisan | undefined;

  constructor(
    private ApiService : ApiService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private RechercheService: RechercheService,
    private sanitizer: DomSanitizer,
  ) {
    this.searchSubscription = this.RechercheService.searchTerm$.subscribe(
      (term) => {
        this.searchTerm = term;
        this.searchArt();
      },
    );
    this.ApiService.getArtisans().subscribe((artisans) => {
      this.artisans = artisans;
      this.sortedArtisans = [...this.artisans];
    });
  }

  sanitizeHtml(unsafeHtml: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  // F affiche les artisans / nom, job, ville
  searchArt(): void {
    if (!this.artisans) {
      return;
    }
    if (this.sanitizeHtml(this.searchTerm)) {
      this.sortedArtisans = this.artisans.filter(
        (artisan) =>
          artisan.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          artisan.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          artisan.location.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      console.log('error');
    }
  }




  // F affiche artisans selon nom cat ville
  searchArtisans(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.searchTerm = target.value.toLowerCase();
    if (this.sanitizeHtml(this.searchTerm)) {
      this.sortedArtisans = this.artisans.filter(
        (artisan) =>
          artisan.name.toLowerCase().includes(this.searchTerm) ||
          artisan.specialty.toLowerCase().includes(this.searchTerm) ||
          artisan.location.toLowerCase().includes(this.searchTerm),
      );
    } else {
      console.log('err');
    }
  }

  //F  calls the filterArtisansByCategory 

  sortArtisans(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    if (this.selectedCategory) {
      this.filterArtisansByCategory(this.selectedCategory);
    } else {
      this.ApiService.getArtisans().subscribe((artisans) => {
        this.artisans = artisans;
        this.sortedArtisans = [...this.artisans];
        this.cdRef.detectChanges();
      });
    }
  }

  //F tri artisan par cat
  filterArtisansByCategory(category: string): void {
    this.ApiService.getArtisans().subscribe((artisans) => {
      this.sortedArtisans = artisans.filter(
        (artisan) => artisan.category === category,
      );
      this.cdRef.detectChanges();
    });
  }

  //F uttilise categorie dans url pour afficher
  ngOnInit(): void {
    const category = this.route.snapshot.data['category'];
    if (category) {
      this.filterArtisansByCategory(category);
    } else {
      this.ApiService.getArtisans().subscribe((artisans) => {
        this.artisans = artisans;
        this.sortedArtisans = [...this.artisans];
        this.cdRef.detectChanges();
      });
    }
  }
} 
  
export interface Artisan {
  id: string;
  name: string;
  specialty: string;
  note: number;
  location: string;
  about: string;
  email: string;
  website: string;
  category: string;
  top: boolean;
} 