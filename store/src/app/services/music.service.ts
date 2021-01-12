import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";

import { BehaviorSubject, Observable, Subject, throwError, of } from "rxjs";
import { catchError, map, tap, retry } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Song } from "../song";
import { HttpErrorHandler, HandleError } from "./http-error.service";
import { LoginService } from "../services/login.service";

@Injectable({
  providedIn: "root",
})
export class MusicService {
  configUrl = "assets/config.json";
  userId: string;
  private song_id: BehaviorSubject<string>;
  private handleError: HandleError;
  songs$: Observable<Song[]>;
  downloads$: Observable<Song[]>;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    httpErrorHandler: HttpErrorHandler // private httpheaders: HttpHeaders, // private httpparams: HttpParams
  ) {
    this.handleError = httpErrorHandler.createHandleError(
      "songs service error"
    );
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
    });
    this.song_id = new BehaviorSubject<string>("");
    this.songs$ = this.http
      .get<Song[]>(this.songsURL + "latest_songs")
      .pipe(
        catchError(this.handleError<Song[]>("Failed to get audio library"))
      );
  }

  options: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: "body" | "events" | "response";
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: "arraybuffer" | "blob" | "json" | "text";
    withCredentials?: boolean;
  };

  public songsURL = environment.apiUrl + "/";

  getSongs(): Observable<Song[]> {
    // @ts-ignore
    // if (!user_id || user_id == "") return of([]);
    return (this.songs$ = this.http
      .get<Song[]>(this.songsURL + "latest_songs")
      .pipe(
        catchError(this.handleError<Song[]>("Failed to get audio library"))
      ));
  }

  getMyDownloads(userId): Observable<Song[]> {
    console.log("user id is " + userId + "\n" + this.songsURL+"my_songs/" + userId);
    return (this.downloads$ = this.http.get<Song[]>(this.songsURL + "my_songs/" + userId));
  }

  public getSongList(): Observable<Song[]> {
    return this.http
      .get<Song[]>(this.songsURL + "latest_songs")
      .pipe(
        catchError(this.handleError<Song[]>("Failed to get audio library"))
      );
  }

  getSong(song_id): Observable<Song[]> {
    return this.http.get<Song[]>(this.songsURL + "song/" + song_id);
  }

  getLatestSongs(): Observable<Song[]> {
    console.log("getting store songs");
    return (this.songs$ = this.http.get<Song[]>(
      this.songsURL + "latest_songs"
    ));
  }


  getMyDownloadLink(song_id): Observable<Song[]> {
    console.log("firing from service for song ID " + song_id);
    return this.http.get<Song[]>(
      this.songsURL + "song/download_song/" + song_id
    );
  }
  getMyLicense(song_id): Observable<Song[]> {
    console.log("getting license from service for Song ID " + song_id);
    return this.http.get<Song[]>(this.songsURL + "download_license/" + song_id);
  }
}
