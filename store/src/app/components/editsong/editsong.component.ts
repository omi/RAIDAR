import { Component, OnInit, Input, Inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
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
//import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: "app-editsong",
  templateUrl: "./editsong.component.html",
  styleUrls: ["./editsong.component.scss"],
})
export class EditsongComponent implements OnInit {
  @Input() selectedSong: Song;
  @Input() song: Song;
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

  constructor(
    private musicService: MusicService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditsongComponent>,
    @Inject(MAT_DIALOG_DATA) song
  ) {
    this.song = song;
  }

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
  }

  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, "") : "";
  }

  close() {
    this.dialogRef.close();
    // this.Edit.unsubscribe();
  }
  ngOnDestory() {
    //this.musicService.getMyUploads(this.userId);
  }
}
