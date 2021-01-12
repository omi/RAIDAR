import { Injectable } from '@angular/core';
import { Payout } from '../payout';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

import {Observable, Subject, throwError, of } from 'rxjs';
import { catchError, map, tap, retry } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Song } from "../song";
import { HttpErrorHandler, HandleError } from "./http-error.service";
import { LoginService } from "../services/login.service";
import { MusicService } from "../services/music.service";

@Injectable({
  providedIn: 'root'
})
export class PayoutsService {

  userId: string;
  private handleError: HandleError;
  public payoutsURL = environment.apiUrl + "/my_song_transactions/";

  payouts$: Observable<Payout[]>;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    httpErrorHandler: HttpErrorHandler

  ) {
    this.handleError = httpErrorHandler.createHandleError("Payouts Service Error");
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
    });

   }

  getPayouts(user_id): Observable<Payout[]> {
    if (!user_id || user_id == "") return of([]);
    this.payouts$ = this.http
      .get<Payout[]>(this.payoutsURL + user_id)
      .pipe(catchError(this.handleError<Payout[]>("Failed to get payouts please try again later")));
    return this.payouts$;
  }
}
