import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { MusicService } from "../../services/music.service";
import { Song } from "src/app/song";
import { EventEmitter } from "@angular/core";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { LoginService } from "../../services/login.service";
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
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./playerdetail.component.html",
  styleUrls: ["./playerdetail.component.scss"],
})
export class PlayerdetailComponent implements OnInit {
  @Output() urlActivated = new EventEmitter();
  @Input() itemSelected = false;
  songData: any;
  faExclamationTriangle = faExclamationTriangle;
   month = new Array();

  constructor(
    public httpErrorHandler: HttpErrorHandler,
    private loginService: LoginService,
    private musicService: MusicService,
    private dialog: MatDialog
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
  @Input() song: Song;
  @Input() selectedSong: Song;
  @Output() songs: Array<Song>;
  @Output() songTags: Song["tags"];
  userId: any;
  songTitle: any;
  
  get songs$(): Observable<Song[]> {
    return this.musicService.songs$;
  }

  ngOnInit(): void {}

  ngOnChanges() {
    return this.musicService.songs$;
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
      recording_location: this.song.recording_location,
      bpm: this.song.bpm,
      price: this.song.price,
      user_id: this.song.user_id,
      mood: this.song.mood,
      genre: this.song.genre,
      tags: this.song.tags,
      performer_known_as: this.song.performer_known_as,
      song_writer: this.song.song_writer,
      song_producer: this.song.song_producer,
      mixing_engineer: this.song.mixing_engineer,
      mastering_engineer: this.song.mastering_engineer,
      has_vocals: this.song.has_vocals,
    };
    const dialogRef = this.dialog.open(EditsongComponent, dialogConfig);
    // this.dialog.open(EditsongComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
     this.urlActivated.emit();
    }),
      {};
  }

    getRecordingDate(song) {
    let d = new Date(song.recording_date);
    return this.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
}

// editSong(): void {
//   const MatDialog = this.dialog.open(EditsongComponent, {
//     data: {
//       title: "title",
//     },
//   });
// }
