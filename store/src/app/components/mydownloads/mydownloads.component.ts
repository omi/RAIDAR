import { Component, OnInit, Input } from "@angular/core";
import { MusicService } from "../../services/music.service";
import { Song } from "../../song";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import {
  HttpErrorHandler,
  HandleError,
} from "../../services/http-error.service";
import { LoginService } from "../../services/login.service";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { DownloadmodalComponent } from "../downloadmodal/downloadmodal.component";

@Component({
  selector: "app-downloads",
  templateUrl: "./mydownloads.component.html",
  styleUrls: ["./mydownloads.component.scss"],
})
export class DownloadsComponent implements OnInit {
  song_id: any;
  faExclamationTriangle = faExclamationTriangle;
  constructor(
    private musicService: MusicService,
    private loginService: LoginService,
    private dialog: MatDialog,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.month[0] = "January";
    this.month[1] = "February";
    this.month[2] = "March";
    this.month[3] = "April";
    this.month[4] = "May";
    this.month[5] = "June";
    this.month[6] = "July";
    this.month[7] = "August";
    this.month[8] = "September";
    this.month[9] = "October";
    this.month[10] = "November";
    this.month[11] = "December";

  }

  selectedSong: Song;
  month = new Array();
  length: number;
  songs: Array<Song>;
  song: Song;
  songsName: any = { song_title: "" };
  order = "name";
  userId: string = null;
  downloadurl: string = "";

  get songs$(): Observable<Song[]> {
    return this.musicService.downloads$;
  }

  openSong(songId) {
    console.log("open modal + ", songId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "680px";
    dialogConfig.data = {
      song_id: songId,
      // musical_key: this.song.musical_key,
      // recording_engineer: this.song.recording_engineer,
      // recording_date: this.song.recording_date,
      // bpm: this.song.bpm,
      // price: this.song.price,
      // user_id: this.song.user_id,
      // mood: this.song.mood,
      // genre: this.song.genre,
      // tags: this.song.tags,
      // performer_known_as: this.song.performer_known_as,
      // song_writer: this.song.song_writer,
      // song_producer: this.song.song_producer,
      // mixing_engineer: this.song.mixing_engineer,
      // mastering_engineer: this.song.mastering_engineer,
      // has_vocals: this.song.has_vocals,
    };
    this.dialog.open(DownloadmodalComponent, dialogConfig);
  }

  ngOnInit() {
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
      this.musicService.getMyDownloads(this.userId).subscribe((songs) => {
        this.songs = songs;
      });
    });
  }
  getArtistName(song) {
    return song.performer_known_as === "" ? song.song_writer : song.performer_known_as;
  }

  getRecordingDate(song) {
    let d = new Date(song.recording_date);
    return this.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
}
