import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../../services/login.service';
import { PayoutsService } from '../../services/payouts.service';
import { Payout } from '../../payout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: string;
  payouts: Array<Payout>;
  count:any = 0;
  payoutSource;

  constructor(
    private loginService: LoginService,
    private payoutService: PayoutsService
  ) { }

  ngOnInit() {
    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;
      this.payoutService.getPayouts(this.userId).subscribe((value) => {
        this.payouts = value;
        this.payoutSource = new MatTableDataSource<any>(this.payouts);
        this.setCount();
      });
    });
  }
  
  setCount(){
    let length = this.payouts.length;
    this.count = (length > 0) ? length : 0;
  }

  getArtistName(payout) {
    let pka = payout.performer_known_as;
    return pka.length == 0 ? payout.song_writer : pka;
  }

  displayedColumns: string[] = ['song_title', 'artist', 'amount', 'paypal_transaction_id', 'active'];
  dataSource = this.payouts;

}
