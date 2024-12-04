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
  styleUrl: './fiche.component.scss'
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

  //function which disinfect and secure data.
  sanitizeHtml(unsafeHtml: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  //Function to display the craftsman having the same id as the one in the url
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

  //Function to create an alert when the form is submitted in order to know if the action is carried out or not
  public alertEmail(message: any, type: any) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')!;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('');
    alertPlaceholder.append(wrapper);
  }

  //Function using EmailService by sending it the form data and which reacts based on the response
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
          console.log('Email sent successfully');
          this.contactForm.reset();
          this.alertEmail('Votre message a été envoyé !', 'success');
        })
        .catch((error) => {
          console.error('Failed to send email', error);
          this.alertEmail(
            "ERREUR ! Votre message n'a pas été envoyé !",
            'danger',
          );
        });
    } else {
      console.log('Code malveillant');
    }
  }
}
