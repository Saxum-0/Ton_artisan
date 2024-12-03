import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RechercheService } from '../recherche.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent {

  favicon: any = './src/assets/favicon.png';
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
  //function which disinfect and secure data.
  sanitizeHtml(unsafeHtml: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  // function allowing you to display the artisans sought according to their name, their city or their profession
  searchArt(): void {
    if (!this.artisans) {
      return;
    }
    if (this.sanitizeHtml(this.searchTerm)) {
      this.sortedArtisans = this.artisans.filter(
        (artisan) =>
          artisan.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          artisan.specialty
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          artisan.location
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()),
      );
    } else {
      console.log('Code malveillant');
    }
  }

  //Function to destroy an observable
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  // function allowing you to display the artisans sought according to their name, their city or their profession
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
      console.log('Code malveillant');
    }
  }

  //Function reacting to the select tag and which, depending on the user's action, calls the filterArtisansByCategory function
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

  //Function to sort artisans according to their category
  filterArtisansByCategory(category: string): void {
    this.ApiService.getArtisans().subscribe((artisans) => {
      this.sortedArtisans = artisans.filter(
        (artisan) => artisan.category === category,
      );
      this.cdRef.detectChanges();
    });
  }

  //Function allowing you to retrieve the category of the URL and display the artisans in this category using the filterArtisansByCategory function
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