import { Component, OnInit, Input } from "@angular/core";
import { Song } from "../../../app/song";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-song",
  templateUrl: "./song.component.html",
  styleUrls: ["./song.component.scss"],
})
export class SongComponent implements OnInit {
  @Input() file_preview_loc;
  @Input() song_title;
  @Input() song: Song;
  faExclamationTriangle = faExclamationTriangle;
  
  constructor() {}
  msbapTitle = this.song_title;
  msbapAudioUrl = this.file_preview_loc;
  msaapDisplayVolumeControls = true;

  ngOnInit(): void {}
}
