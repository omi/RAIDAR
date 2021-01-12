import { Component, EventEmitter, OnInit, Input, Inject, Output } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Song } from "../../song";
import { MusicService } from "../../services/music.service";
import { LoginService } from "../../services/login.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SongComponent } from "../song/song.component";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { emit } from "process";
//import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface MusicalKeys {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-editsong",
  templateUrl: "./editsong.component.html",
  providers: [MusicService],
  styleUrls: ["./editsong.component.scss"],
})
export class EditsongComponent implements OnInit {
  @Input() selectedSong: Song;
  @Input() song: Song;
  @Output() edited = new EventEmitter();
  song_id: string = null;
  userId: string;
  // title: any = this.song.song_title;
  name: any;

  songId: any;
  tags: any;
  genre: any;
  metaData = this.fb.group({});
  songs: Array<Song>;
  minDate: Date;
  maxDate: Date;
  hasVocals: string;

  constructor(
    private musicService: MusicService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditsongComponent>,
    @Inject(MAT_DIALOG_DATA) song
  ) {
    this.song = song;
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split("T")[0];
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(today + 1);
  }
  
  Edit: any = '';

  ngOnInit(): void {
    this.musicService.getSong(this.song_id);
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
      this.musicService.getSong(this.song_id);
      const today = new Date().toISOString().split("T")[0];
      document
        .getElementsByName("recording_date")[0]
        .setAttribute("max", today);
    });

    this.metaData = this.formBuilder.group({
      song_title: [this.song.song_title, Validators.required],
      song_writer: [this.song.song_writer, Validators.required],
      performer_known_as: [this.song.performer_known_as],
      genre: [this.song.genre],
      mood: [this.song.mood],
      tags: [this.song.tags],
      musical_key: [this.song.musical_key],
      recording_engineer: [this.song.recording_engineer],
      recording_location: [this.song.recording_location],
      bpm: [this.song.bpm, Validators.required],
      mixing_engineer: [this.song.mixing_engineer],
      mastering_engineer: [this.song.mastering_engineer],
      song_producer: [this.song.song_producer],
      recording_date: [this.song.recording_date],
      user_id: [this.userId],
      price: [{ value: 50, disabled: true }],
      has_vocals: [this.song.has_vocals],
    });
  }

  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, "") : "";
  }

    reload() {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['./audio-library'], { relativeTo: this.route });
}

  save() {
    this.musicService.editSong(this.song).subscribe(() => this.snackBar.open(
      this.song.song_title + " Edited Successfully",
      "Close",
      { duration: 3000 }
    ),
  );
  this.dialogRef.close();
  this.reload();
  }
  // move this to service //

  goBack(): void {
    this.location.back();
  }

  close() {
    this.musicService.getMyUploads(this.userId);
    this.dialogRef.close();
    this.Edit.unsubscribe();
    this.selectedSong = null;
   
    // this.Edit.unsubscribe();
  }
  // ngOnDestory() {
  //   this.musicService.getMyUploads(this.userId).subscribe((songs) => {
  //     this.songs = songs;
  //   });
  // }
}
