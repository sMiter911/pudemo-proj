import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StructuresService implements OnInit {
  private _jsonUrl = '../assets/Structures.json';

  constructor(private httpClient: HttpClient) {
    this.getJSON().subscribe((data) => {
      console.log(data);
    });
  }

  ngOnInit() {}

  public getJSON(): Observable<any> {
    return this.httpClient.get(this._jsonUrl);
  }
}
