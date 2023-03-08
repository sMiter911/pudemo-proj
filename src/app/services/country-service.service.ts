import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryServiceService implements OnInit {
  countryURl = 'https://restcountries.com/v2/all';
  private _jsonUrl = '../assets/CountryCode.json';

  constructor(private httpClient: HttpClient) {
    this.getJSON().subscribe((data) => {
      console.log(data);
    });
  }

  ngOnInit() {}

  getCountries() {
    return this.httpClient.get(this.countryURl);
  }

  public getJSON(): Observable<any> {
    return this.httpClient.get(this._jsonUrl);
  }
}
