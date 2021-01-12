import { Component, OnInit, Input } from "@angular/core";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-taglist",
  templateUrl: "./taglist.component.html",
  styleUrls: ["./taglist.component.scss"],
})
export class TaglistComponent implements OnInit {
  @Input() songtags;
  faExclamationTriagle = faExclamationTriangle;
  faTags = faTags;
  mytags: string;
  fancyTags: Array<string>;

  // constructor() {}

  ngOnInit(): void {
    this.fancyTags = this.songtags.split(',');
    //this.fancyTags = this.mytags.split(",");
    // this.convertArray(this.songtags);
  }

  // convertArray(songtags) {
  //   return (this.fancyTags = this.songtags.split(","));
  // }
}
