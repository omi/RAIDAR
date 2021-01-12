import { Component, OnInit, ViewChild, Output, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { MusicService } from "../../services/music.service";
import { KeysPipe } from "../../keys.pipe";
import { Song } from "../../song";
// import { SONGS } from "../../mock-songs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { MessageService } from "src/app/services/message.serice";
import { HttpResponse } from "@angular/common/http";

import { SongComponent } from "../song/song.component";
import { EditsongComponent } from "../editsong/editsong.component";
import { LoginService } from "../../services/login.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";

@Component({
  selector: "app-player",
  providers: [MusicService, HttpErrorHandler, MessageService],
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
  // @Input() songs: Array<Song>;
  // songs = SONGS;
  // audioSources: Plyr.Source[] = this.song.src;
  @Output() Song;
  @Output() itemSelected = false;
  currentItemsToShow = [];
  userId: string = null;


  constructor(
    private musicService: MusicService,
    private router: Router,
    public httpErrorHandler: HttpErrorHandler,
    public dialog: MatDialog,
    private loginService: LoginService
  ) {
  }
  selectedSong: any;
  length: number;
  songs: Array<Song>;
  songsName: any = { song_title: "" };
  order = "song_title";
  get songs$(): Observable<Song[]> {
    return this.musicService.songs$;
  }

  onSelect(song: Song) {
    this.itemSelected = true;
    this.selectedSong = song;
  }


getSongs(): void {
  console.log('component ' + this.userId);
  this.musicService.getMyUploads(this.userId);
}

ngOnInit() {
  this.loginService.getUserId().subscribe((value) => {
    this.userId = value;
    this.getSongs();

  });
}

TrackByIndex(index: number, el: any): number {
  return el.id;
}

toArray(tags: object) {
  return Object.keys(tags).map((key) => tags[key]);
}
onUrlActivated() {
  this.ngOnInit();
}
}
