import { Component, Input} from '@angular/core';
import { Artisan } from '../liste/liste.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormService } from '../form.service';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss',

})
export class FicheComponent {

  favicon: any = 'favicon.png';
  

  @Input() name: string = '';
  @Input() job: string = '';
  @Input() category: string = '';
  @Input() location: string = '';
  @Input() image: any;
  @Input() description: string = '';

  artisan: Artisan | undefined;

  contactForm: FormGroup;

  constructor(
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private sanitizer: DomSanitizer,
  ) {
    this.contactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      object: ['', Validators.required],
      comments: ['', Validators.required],
    });
  }



  sanitizeHtml(unsafeHtml: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  //F Affiche artisan selon ID URL
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiservice.getArtisans().subscribe((data) => {
        this.artisan = data.find((artisan) => artisan.id === id);
      });
    } else {
      console.error('ID non défini');
    }
  }


  //F email service
  onSubmit(e: Event) {
    e.preventDefault();
    if (this.sanitizeHtml(this.contactForm)) {
      const templateParams = {
        firstname: this.contactForm.value.firstname,
        lastname: this.contactForm.value.lastname,
        email: this.contactForm.value.email,
        object: this.contactForm.value.object,
        comments: this.contactForm.value.comments,
      };
      this.formService
        .sendEmail(templateParams)
        .then(() => {
          console.log('Email envoyé');
          this.contactForm.reset();
          
        })
        .catch((error) => {
          console.error('error', error);
          
        });
    } else {
      console.log('erreur');
    }
  }
}
