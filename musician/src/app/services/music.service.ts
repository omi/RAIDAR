import { Injectable } from "@angular/core";

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";

import { Observable, Subject, throwError, of } from "rxjs";
import { catchError, map, tap, retry } from "rxjs/operators";

import { environment } from '../../environments/environment';
import { Song } from "../song";
import { HttpErrorHandler, HandleError } from "./http-error.service";
import { LoginService } from "../services/login.service";
import { SongComponent } from "../components/song/song.component";

@Injectable({
  providedIn: "root",
})
export class MusicService {
  configUrl = "assets/config.json";
  userId: string;
  song_id: string = null;
  private handleError: HandleError;
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    httpErrorHandler: HttpErrorHandler // private httpheaders: HttpHeaders, // private httpparams: HttpParams
  ) {
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
    });
  }

  options: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: "body" | "events" | "response";
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: "arraybuffer" | "blob" | "json" | "text";
    withCredentials?: boolean;
  };

  songs$: Observable<Song[]>;
  song$: Observable<Song[]>;

  public songsURL = environment.apiUrl + "/";

  // getSongs(): Observable<Song[]> {
  //   return this.http.get<Song[]>(this.songsURL + "songs");
  // } -- adding leaving this for store app

  getSongs(userId): Observable<Song[]> {
    // @ts-ignore
    if (!userId || userId == "") return of([]);
    return this.http
      .get<Song[]>(this.songsURL + "my_uploads/" + userId)
      .pipe(catchError(this.handleError<Song[]>("Failed to get my uploads")));
  }

  getSong(song_id): Observable<Song[]> {
    return this.http.get<Song[]>(this.songsURL + "song/" + song_id);
  }

  getMyUploads(userId: string): void {
    console.log("reguesting uploaded songs");
    console.log("firing from service " + this.userId);
    this.songs$ = this.http.get<Song[]>(this.songsURL + "my_uploads/" + userId);
  }

  editSong(song: Song): Observable<any> {
    console.log("song from edit is " + song.song_id);
    return this.http.put<any>(this.songsURL + "song/" + song.song_id, song, {});
  }
}
