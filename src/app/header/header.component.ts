import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Artisan } from '../liste/liste.component';
import { ApiService } from '../api.service';
import { RechercheService } from '../recherche.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
  
})
export class HeaderComponent {
logo: any = "./assets/logo.png"
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

  
sanitizeHtml(unsafeHtml: any): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
}




//Recherche navbar

  searchArtisans(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.sanitizeHtml(searchTerm)) {
      this.RechercheService.setSearchTerm(searchTerm);
      this.router.navigate(['/artisan']);
    }
    else {
      console.log("Code malveillant");
    }
  }

}

