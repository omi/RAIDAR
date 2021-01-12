import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edu-term',
  templateUrl: './edu-term.component.html',
  styleUrls: ['./edu-term.component.scss']
})
export class EduTermComponent implements OnInit {

  @Input() term: string;
  @Input() definition: any;

  constructor() { }

  ngOnInit(): void {
  }

}
