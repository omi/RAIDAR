import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "angularx-social-login";
import { LoginService } from "../../services/login.service";
import { Injectable } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { SocialUser } from "angularx-social-login";
import { MusicService } from "src/app/services/music.service";
import { Song } from "../../song";
import { text } from "@fortawesome/fontawesome-svg-core";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { MessageService } from "src/app/services/message.serice";
import { UploadService } from "src/app/services/upload.service";
import { UploadResponse } from "src/app/uploadResponse";
import { DisableControlDirective } from "../../directives/disablecontrol";
import { MatStepper, MatStepperNext } from "@angular/material/stepper";

interface MusicalKeys {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
  providers: [
    UploadService,
    MusicService,
    HttpClient,
    AuthService,
    MessageService,
    { provide: HttpErrorHandler },
  ],
})
@Injectable({
  providedIn: "root",
})
export class UploadComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private musicService: MusicService,
    private uploadService: UploadService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(today);
  }

  @ViewChild("stepper") private myStepper: MatStepper;

  minDate: Date;
  maxDate: Date;
  user: SocialUser;
  loggedIn: boolean;
  agree: boolean;
  uploadResponse: any = { status: "", message: "", filePath: "" };
  error: string;
  songID: any;
  userId: string;
  url: any = null;
  terms: any;
  songFile: any;
  buttonDisabled = false;
  fileSelected = false;
  successBox: boolean;
  processingBox: boolean;
  processingSong: boolean;
  disable: string;
  fieldsetDisabled: boolean;
  selectedKey = "Minor";
  hasVocals: string;
  select;

  tonality = [
    { values: "minor", viewValue: "Minor" },
    { values: "major", viewValue: "Major" },
  ];

  songData = this.fb.group({
    songFile: ["", Validators.required],
  });

  metaData = this.fb.group({
    song_title: ["", Validators.required],
    song_writer: ["", Validators.required],
    performer_known_as: [""],
    genre: [""],
    mood: [""],
    tags: [""],
    musical_key: ["", Validators.required],
    recording_engineer: [""],
    recording_location: [""],
    bpm: ["", Validators.required],
    mixing_engineer: [""],
    mastering_engineer: [""],
    song_producer: [""],
    recording_date: ["", Validators.required],
    user_id: [this.userId],
    price: [{ value: "50", disabled: true }],
    has_vocals: [""],
  });
  song_file = this.songData.value;

  // setDate() {
  //   const today = new Date().toISOString().split("T")[0];
  //   document.getElementsByName("recording_date")[0].setAttribute("max", today);
  // }

  ngOnInit() {
    this.processingSong = false;
    this.loginService.getLoggedIn().subscribe((value) => {
      this.loggedIn = value;
    });
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
      this.metaData.get("user_id").setValue(value);
    });
    this.processingBox = false;
    this.successBox = false;
    this.fieldsetDisabled = true;
    this.metaData = this.formBuilder.group({
      song_title: ["", Validators.required],
      song_writer: ["", Validators.required],
      performer_known_as: [""],
      genre: ["", Validators.required],
      mood: ["", , Validators.required],
      tags: ["", Validators.required],
      musical_key: ["", Validators.required],
      recording_engineer: [""],
      recording_location: [""],
      bpm: ["", Validators.required],
      mixing_engineer: [""],
      mastering_engineer: [""],
      song_producer: [""],
      recording_date: ["", Validators.required],
      user_id: [this.userId],
      price: [{ value: "50", disabled: true }],
      has_vocals: [""],
    });
    this.songData = this.formBuilder.group({
      songFile: new FormControl(""),
    });
  }
  goForward() {
    this.myStepper.next();
  }

  createSongID() {
    if (
      (this.songID === null || this.songID === undefined) &&
      this.metaData.valid
    ) {
      this.processingSong = true;
      const headers = new HttpHeaders().set(
        "Content-Type",
        "text/plain; charset=utf-8"
      );
      const metaData = this.metaData.value;
      return this.http
        .post<any>(this.musicService.songsURL + "song", metaData, {})
        .subscribe((response) => {
          this.songID = response.song_id;
          this.url = response.upload_url;
          this.goForward();
        });
    } else {
      this.metaData.markAllAsTouched();
      return this.songID;
    }
  }

  //

  clearOut() {
    this.songID = null;
  }
  selectFile(event) {
    event.preventDefault();
    document.getElementById("songDataField").click();

    if (event.target.files.length > 0) {
      this.fileSelected = true;
      const file = event.target.files[0];
      this.songData.get("songFile").setValue(file);
    }
  }

  onFileChange(event) {
    event.preventDefault();
    this.fileSelected = true;
    const fileA = event.target.files[0];
    if (!fileA) return;
    const fileName = fileA.name;
    this.songData.get("songFile").setValue(fileA);
  }

  uploadSong(event) {
    event.preventDefault();
    const formData = new FormData();
    const songData = this.songData.get("songFile").value;
    const songID = this.songID;
    this.buttonDisabled = true;
    const data = new FormData();
    data.append(songID, songData);
    // data.append("song_id:", this.songID);
    formData.append(songID, songData);
    this.processingBox = true;
    this.uploadService.upload(this.url, songData).subscribe(
      (res) => (this.uploadResponse = res), // @ts-ignore
      (err) => (this.error = err),
      () => ((this.successBox = true), (this.processingBox = false))
    );
    //   return this.http
    //     .post(this.musicService.songsURL + "song/upload", data)
    //     .subscribe((response) => console.log(response));
  }
}
