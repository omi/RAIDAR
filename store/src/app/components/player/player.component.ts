import {
  Component,
  OnInit,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { MusicService } from "../../services/music.service";
import { KeysPipe } from "../../keys.pipe";
import { Song } from "../../song";
// import { SONGS } from "../../mock-songs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { MessageService } from "src/app/services/message.serice";
import { HttpResponse } from "@angular/common/http";
import { LoginService } from "../../services/login.service";
import { CartItemsService } from "../../services/cart-items.service";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { Item } from "../../item";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { EditsongComponent } from "../editsong/editsong.component";
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Component({
  selector: "app-player",
  providers: [HttpErrorHandler, MessageService],
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
  // songs: Array<Song>;
  faExclamationTriangle = faExclamationTriangle;
  song_id: any;
  // songs = SONGS;
  // audioSources: Plyr.Source[] = this.song.src;
  cartItems: Array<Item>;
  @Output() Song;

  @Output() songAdded = new EventEmitter();
  @Input() searched = 0;

  currentItemsToShow = [];
  userId: string = null;
  month = new Array();

  constructor(
    private musicService: MusicService,
    private router: Router,
    public httpErrorHandler: HttpErrorHandler,
    public dialog: MatDialog,
    private loginService: LoginService,
    public cartItemsService: CartItemsService
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
  results: number = 0;
  length: number;
  songs: Array<Song>;
  song: Song;
  songsName: any = { song_title: "" };
  order = "name";

  get songs$(): Observable<Song[]> {
    return this.musicService.songs$;
  }

  ngOnInit() {
    this.musicService.getLatestSongs().subscribe((songs) => {
      this.songs = songs;
    });
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
    });
    this.cartItemsService.getCartItems().subscribe((value) => {
      this.cartItems = value;
    });
    this.searched = 0;
    this.results = 0
  }

  searchedResults(event) {
    // event.length = this.searched
    console.log('did it make it '+ event.length);
  }

  openSong() {
    console.log("open modal");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "680px";
    dialogConfig.data = {
      song_title: this.song.song_title,
      // song_title: this.song.song_title,
      // musical_key: this.song.musical_key,
      // recording_engineer: this.song.recording_engineer,
      // recording_date: this.song.recording_date,
      // recording_loc: this.song.recording_loc,
      // npm: this.song.bpm,
      // price: this.song.price,
      // user_id: this.song.user_id,
      // mood: this.song.mood,
      // genre: this.song.genre,
      // tags: this.song.tags,
      // performer_known_as: this.song.performer_known_as,
      // song_writer: this.song.song_writer,
      // song_producer: this.song.song_producer,
      // vocal_langs: this.song.vocal_langs,
    };

    this.dialog.open(EditsongComponent, dialogConfig);
  }

  addToCart(song_id) {
    this.cartItemsService.addToCart(song_id);
  }

  removeFromCart(song_id) {
    this.cartItemsService.removeFromCart(song_id);
  }

  isInCart(song_id) {
    let isIn = false;
    this.cartItems.forEach(function (c, i) {
      if (c.song_id == song_id) isIn = true;
    });
    return isIn;
  }

  toArray(tags: object) {
    return Object.keys(tags).map((key) => tags[key]);
  }
  onUrlActivated() {
    this.ngOnInit();
  }

  getArtistName(song) {
    return song.performer_known_as === "" ? song.song_writer : song.performer_known_as;
  }

  getRecordingDate(song) {
    let d = new Date(song.recording_date);
    return this.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
}
