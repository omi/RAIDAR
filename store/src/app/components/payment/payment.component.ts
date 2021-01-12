import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CartItemsService } from '../../services/cart-items.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  payPalConfig: IPayPalConfig;
  showSuccess: boolean;

  constructor(public cartItemsService: CartItemsService) { }

  ngOnInit(): void {
    this.cartItemsService.getPayPalConfig().subscribe((value) => {
      this.payPalConfig = value;
    });
    this.cartItemsService.getSuccess().subscribe((value) => {
      this.showSuccess = value;
    });
    this.setup();
  }

  setup(): void {
    this.cartItemsService.updatePayPalConfig();
  }

}
