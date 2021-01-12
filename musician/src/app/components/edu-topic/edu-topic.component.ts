import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  // Placeholder for saving data generated in the dialog modal
  // i.e. How far the user got in reading through the edu content
  leftOff: string;
  title: string;
  contentIntro: any;
  contentRules: any;
  contentExs: any;
  sub: string;
}

@Component({
  selector: 'app-edu-topic',
  templateUrl: './edu-topic.component.html',
  styleUrls: ['./edu-topic.component.scss']
})
export class EduTopicComponent implements OnInit {
  leftOff: string;

  @Input() title: string;
  @Input() img: string;
  @Input() sub: string;
  @Input() contentIntro: string;
  @Input() contentRules: string;
  @Input() contentExs: string;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(EduTopicDialogComponent, {
      data: {
        title: this.title,
        contentIntro: this.contentIntro,
        contentRules: this.contentRules,
        contentExs: this.contentExs,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Placeholder if we want to do anything with "${result}" when dialog closes
    });
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'edu-topic-dialog',
  templateUrl: './edu-topic-dialog.html',
  styleUrls: ['./edu-topic-dialog.scss'],
})
export class EduTopicDialogComponent {
  displayFirst: boolean = true;
  displaySecond: boolean = false;
  displayThird: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EduTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  goBack(): void {
    if (this.displayThird) {
      this.displayThird = false;
      this.displaySecond = true;
    } else if (this.displaySecond) {
      this.displaySecond = false;
      this.displayFirst = true;
    }
  }

  goForward(): void {
    if ((this.data.title != "Copyright") || this.displaySecond) return;
    if (this.displayFirst) {
      this.displayFirst = false;
      this.displaySecond = true;
    } else if (this.displaySecond) {
      this.displaySecond = false;
      this.displayThird = true;
    }
  }

}
