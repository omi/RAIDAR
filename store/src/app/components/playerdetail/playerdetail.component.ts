import { Component, OnInit, Input, Output } from "@angular/core";
import { MusicService } from "../../services/music.service";
import { Song } from "src/app/song";
import { EventEmitter } from "@angular/core";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { EditsongComponent } from "../editsong/editsong.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-playerdetail",
  providers: [HttpErrorHandler],
  templateUrl: "./playerdetail.component.html",
  styleUrls: ["./playerdetail.component.scss"],
})
export class PlayerdetailComponent implements OnInit {
  @Output() urlActivated = new EventEmitter();
  songData: any;
  faExclamationTriangle = faExclamationTriangle;
  constructor(
    public httpErrorHandler: HttpErrorHandler,
    private musicService: MusicService,
    private dialog: MatDialog
  ) {}
  @Input() selectedSong: Song;
  @Input() song: Song;

  songTitle: any;

  ngOnInit(): void {
    this.musicService.getSong(this.song.song_id);
  }

  editSong() {
    console.log("open modal");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "680px";
    dialogConfig.data = {
      song_id: this.song.song_id,
      song_title: this.song.song_title,
      musical_key: this.song.musical_key,
      recording_engineer: this.song.recording_engineer,
      recording_date: this.song.recording_date,
      recording_loc: this.song.recording_location,
      npm: this.song.bpm,
      price: this.song.price,
      user_id: this.song.user_id,
      mood: this.song.mood,
      genre: this.song.genre,
      tags: this.song.tags,
      performer_known_as: this.song.performer_known_as,
      song_writer: this.song.song_writer,
      song_producer: this.song.song_producer,
      vocal_langs: this.song.vocal_langs,
    };

    this.dialog.open(EditsongComponent, dialogConfig);
  }
}

// editSong(): void {
//   const MatDialog = this.dialog.open(EditsongComponent, {
//     data: {
//       title: "title",
//     },
//   });
// }
