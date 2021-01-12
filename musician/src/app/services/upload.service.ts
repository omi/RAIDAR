import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload(url: string, data) {
    return this.http
      .put(url, data, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        map((event) => {
          switch (event.type) {
          case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: "progress", message: progress };
            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }
}
