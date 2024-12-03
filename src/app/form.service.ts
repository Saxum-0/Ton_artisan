import { Injectable } from '@angular/core';
import emailjs, {type EmailJSResponseStatus} from '@emailjs/browser' 

const emails: {

  EMAILJS_SERVICE_ID: string;
  EMAILJS_TEMPLATE_ID: string;
  EMAILJS_USER_ID: string;
}={
  EMAILJS_SERVICE_ID: '',
  EMAILJS_TEMPLATE_ID: '',
  EMAILJS_USER_ID: '',
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor() { }
    private serviceId: string  = emails.EMAILJS_SERVICE_ID;
    private templateId: string  = emails.EMAILJS_TEMPLATE_ID;
    private userId: string  = emails.EMAILJS_USER_ID;


    sendEmail (templateParams: any): Promise<any> {
return emailjs
  .send (this.serviceId, this.templateId, templateParams, this.userId)
  .then(
    (response: any) => {console. log('Success!', response.status, response. text);
    return response;},
    (error: any) => {
      console.error ('Failed...', (error as EmailJSResponseStatus).text);
        throw error;},);}}

