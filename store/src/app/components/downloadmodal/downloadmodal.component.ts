import { Component, OnInit, Input, Inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Song } from "../../song";
import { MusicService } from "../../services/music.service";
import { LoginService } from "../../services/login.service";
import { MatDialogModule } from "@angular/material/dialog";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Url } from "url";
import {
  faCloudDownloadAlt,
  faMusic,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-downloadmodal",
  templateUrl: "./downloadmodal.component.html",
  styleUrls: ["./downloadmodal.component.scss"],
})
export class DownloadmodalComponent implements OnInit {
  downloadurl: any;
  licenseurl: any;
  downloadId: string;
  song_id: any;
  songId: string;
  @Input() selectedSong: Song;
  @Input() song: Song;

  faCloudDownloadAlt = faCloudDownloadAlt;
  faMusic = faMusic;
  faFilePdf = faFilePdf;

  constructor(
    private musicService: MusicService,
    private dialogRef: MatDialogRef<DownloadmodalComponent>,
    @Inject(MAT_DIALOG_DATA) song
  ) {
    this.song = song;
    console.log(song);
    this.song_id = song.song_id;
    console.log(song.song_id);
    console.log(song.song_id);
    // this.song_title = song_title;
    // this.song_id = song_id;
    console.log("modal song_id " + this.song.song_id);
  }

  ngOnInit() {
    this.musicService.getMyLicense(this.song.song_id).subscribe((value) => {
      this.licenseurl = value;
      console.log("license url is " + this.licenseurl.download_url);
    });

    this.musicService
      .getMyDownloadLink(this.song.song_id)
      .subscribe((value) => {
        this.downloadurl = value;
        console.log(this.downloadurl);
        console.log("downloadurl " + this.downloadurl.download_url);
      });
  }

  close() {
    this.dialogRef.close();
  
  }
  ngOnDestory() {
    //this.musicService.getMyUploads(this.userId);
  }
}
