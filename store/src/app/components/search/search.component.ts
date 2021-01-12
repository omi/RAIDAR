import { Component, Injectable, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Song } from "../../song";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";
import { ReactiveFormsModule, FormControl, FormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { TaglistComponent } from "../taglist/taglist.component";
import { CartItemsService } from "../../services/cart-items.service";
import { Item } from "../../item";

class SearchResult {
  constructor(
    album_id: string,
    // $oid: string;
    song_id: string,
    song_title: string,
    song_writer: string,
    song_producer: string,
    recording_engineer: string,
    mixing_engineer: string,
    mastering_engineer: string,
    performer_known_as: string,
    file_location: string,
    file_preview_loc: string,
    license_terms: string,
    musical_key: string,
    recording_country: string,
    recording_date: any,
    recording_frmt: any,
    recording_loc: any,
    ts: any,
    currency: string,
    price: string,
    bpm: number,
    has_vocals: number,
    user_id: string,
    artwork?: string,
    length?: string,
    mood?: string,
    genre?: string,
    tags?: string,
    vocal_langs?: any,
    artwork_loc?: string
  ) {}
}


@Injectable()
export class SearchService {
  apiRoot: string = "https://search.raidar.org/songs/_search";
  results;

  constructor(private http: HttpClient) {}

  public getResults(term: string): any {
    let apiUrl = `${this.apiRoot}` + "\\" + "?q=" + `${term}`;
    return this.http.get(apiUrl);
  }
}

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  public loading: boolean = false;
  public results;
  public searchField: FormControl;
  faExclamationTriangle = faExclamationTriangle;
  month = new Array();
  cartItems: Array<Item>;
  @Output() searched = new EventEmitter<any>();

  constructor(
    private searchService: SearchService,
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

  ngOnInit() {
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((newVal) => {
        this.results = this.search(newVal);
      });
    this.cartItemsService.getCartItems().subscribe((value) => {
      this.cartItems = value;
    });
  }

  search(term) {
    this.results = this.searchService.getResults(term).subscribe((res) => {
      this.results = res.hits.hits;
      this.searched.emit(this.results.length);
      this.searched = this.results.length;
      console.log(this.results.length + ' number of results');
      console.log('this searched = ' +  this.searched);
    });
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

  getArtistName(song) {
    return song.performer_known_as === ""
      ? song.song_writer
      : song.performer_known_as;
  }

  getRecordingDate(song) {
    let d = new Date(song.recording_date);
    return (
      this.month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
    );
  }
}
