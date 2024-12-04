import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class RechercheService {
  
  private searchTermSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
      searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  constructor() {}

  setSearchTerm(term: string): void {this.searchTermSubject.next(term)}
}
  