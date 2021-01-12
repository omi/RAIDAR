import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HttpErrorHandler, HandleError } from "./http-error.service";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { IPayPalConfig, ICreateOrderRequest, IPurchaseUnit } from "ngx-paypal";

import { environment } from '../../environments/environment';
import { LoginService } from "../services/login.service";
import { Item } from "../item";
import { Song } from "../song";

@Injectable({
  providedIn: "root",
})
export class CartItemsService {
  private handleError: HandleError;
  private baseUrl = environment.apiUrl;
  private songPrice = environment.songPrice;
  private isProd = environment.production;
  private payPalClient = environment.payPalClient;
  private userId: string;

  private cartItems: BehaviorSubject<Array<Item>>;
  private cartSongs: BehaviorSubject<Array<Song>>;
  private cartTotal: BehaviorSubject<string>;
  private cartFee: BehaviorSubject<string>;
  private songs;

  private payPalConfig: BehaviorSubject<IPayPalConfig>;
  private showSuccess: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler,
    private loginService: LoginService
  ) {
    this.handleError = httpErrorHandler.createHandleError(
      "CartItemsService Error"
    );
    this.cartItems = new BehaviorSubject([]);
    this.cartSongs = new BehaviorSubject([]);
    this.cartTotal = new BehaviorSubject("");
    this.cartFee = new BehaviorSubject("");
    this.payPalConfig = new BehaviorSubject<IPayPalConfig>(null);
    this.showSuccess = new BehaviorSubject<boolean>(false);

    this.loginService.getUserId().subscribe((value) => {
      this.userId = value;

      // Temporarily set test price for production test user
      // So that we can cheaply test PayPal Live in production
      if (value === "e5f95268-f623-11ea-89a3-4a32d95acf41") {
        this.songPrice = 1;
        this.isProd = false;
      }
    });

    this.http
      .get<Song[]>(this.baseUrl + "/latest_songs")
      .pipe(catchError(this.handleError<Song[]>("Failed to get latest songs")))
      .subscribe((value) => {
        this.songs = value;
        this.updateVariables();
      });
  }

  public getCartItems(): Observable<Array<Item>> {
    return this.cartItems.asObservable();
  }

  public getCartSongs(): Observable<Array<Song>> {
    return this.cartSongs.asObservable();
  }

  private calculateSongTotal() {
    let total = 0;
    let price = this.songPrice
    this.cartItems.value.forEach(function (c, i) {
      total += c.quantity * price;
    });
    return total;
  }

  private calculateGrandTotal(songTotal) {
    // Add on PayPal's payment processing fee of 2.9% + $0.30
    // Round up $0.01 so we can always cover the payout after fees
    return ( (songTotal + 0.3) / (1 - 0.029) ) + 0.01;
  }

  public getCartFee(): Observable<string> {
    let songTotal = this.calculateSongTotal();
    let grandTotal = this.calculateGrandTotal(songTotal)
    this.cartFee.next((grandTotal - songTotal).toFixed(2));
    return this.cartFee.asObservable();
  }

  public getCartTotal(): Observable<string> {
    let songTotal = this.calculateSongTotal();
    let grandTotal = this.calculateGrandTotal(songTotal);
    this.cartTotal.next(grandTotal.toFixed(2));
    return this.cartTotal.asObservable();
  }

  public getPayPalConfig(): Observable<IPayPalConfig> {
    return this.payPalConfig.asObservable();
  }

  public setPayPalConfig(newValue): void {
    this.payPalConfig.next(newValue);
  }

  public getSuccess(): Observable<boolean> {
    return this.showSuccess.asObservable();
  }
  public setSuccess(newValue): void {
    return this.showSuccess.next(newValue);
  }

  public getArtistName(song) {
    return song["performer_known_as"] != ""
      ? song["performer_known_as"]
      : song["song_writer"];
  }

  public getSongTotal(song, cartItem) {
    if (this.isProd) return song["price"] * cartItem["quantity"];
    else return this.songPrice * cartItem["quantity"];
  }

  isEmpty(cart) {
    !Object.keys(cart).length;
  }

  updateVariables() {
    let tmpCartSongs = [];
    let songs = this.songs;
    this.cartItems.value.forEach(function (c, i) {
      tmpCartSongs[i] = c;
    });
    if (tmpCartSongs) {
      tmpCartSongs.forEach(function (c, i) {
        tmpCartSongs[i] = songs.find((cs) => cs.song_id == c.song_id);
      });
    }
    this.cartSongs.next(tmpCartSongs);
    this.getCartTotal();
  }

  addToCart(song_id) {
    let currentCart = this.cartItems.value;
    let id = song_id;
    if (id) {
      var item: Item = {
        song_id: id,
        quantity: 1,
      };
      if (this.cartItems == new BehaviorSubject([])) {
        this.cartItems.next([...currentCart, item]);
      } else {
        let index: number = -1;
        let i: number = -1;
        currentCart.forEach(function (it) {
          i++;
          if (it.song_id == id) {
            index = i;
          }
        });
        if (index == -1) {
          this.cartItems.next([...currentCart, item]);
        } else {
          let item: Item = this.cartItems.value[index];
          item.quantity += 1;
          currentCart[index] = item;
          this.cartItems.next(currentCart);
        }
      }
      this.updateVariables();
    }
  }

  removeFromCart(song_id) {
    let currentCart = this.cartItems.value;
    let id = song_id;
    if (this.cartItems == new BehaviorSubject([])) {
      return;
    } else {
      let index: number = -1;
      currentCart.forEach(function (it) {
        index++;
        if (it.song_id == id) {
          currentCart.splice(index, 1);
          return;
        }
      });
    }
  }

  public updatePayPalConfig(): void {
    let items = [];
    let songIds = "";
    let value = this.cartTotal.value;
    let amount = {
      currency_code: "USD",
      value: value,
      breakdown: {
        item_total: {
          currency_code: "USD",
          value: value,
        },
      },
    };

    let songs = this.songs;
    let thisClass = this;
    this.cartItems.value.forEach(function (c, i) {
      songIds += songIds.length ? "," + c.song_id : c.song_id;
      let thisSong = songs.find((cs) => cs.song_id == c.song_id);
      items.push({
        name: thisSong.song_title + " by " + thisClass.getArtistName(thisSong),
        quantity: c.quantity,
        category: "DIGITAL_GOODS",
        unit_amount: {
          currency_code: "USD",
          value: (thisClass.isProd) ? thisSong.price : thisClass.songPrice,
        },
      });
    });
    items.push({
      name: "Payment processing fee",
      quantity: 1,
      category: "DIGITAL_GOODS",
      unit_amount: {
        currency_code: "USD",
        value: this.cartFee.value
      }
    });

    let config = {
      currency: "USD",
      clientId: this.payPalClient,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: amount,
              items: items,
            },
          ],
        },
      advanced: {
        commit: "true",
      },
      style: {
        label: "paypal",
        layout: "vertical",
      },
      onApprove: (data, actions) => {
        // transaction was approved, but not yet authorized
        actions.order.get().then((details) => {
          // details.id is a string that we can pass to the PayPal API --> /orders to see all info about this payment
          // see the Postman GET for Orders for details. Probably ideal for us to store this order ID in our DB.
        });
      },
      onClientAuthorization: (data) => {
        this.setSuccess(true);

        // Log the order details to Raidar backend
        this.logSuccessfulTransaction(songIds, data.id);

        // Close the cart dialog
        let el: HTMLElement = document.getElementsByClassName(
          "cdk-overlay-backdrop"
        )[0] as HTMLElement;
        el.click();
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
        // Show a cancel banner
      },
      onError: (err) => {
        console.log("OnError", err);
        // Show an error banner
      },
      onClick: (data, actions) => {
        // Fires when a payment method is chosen
      },
    };
    this.setPayPalConfig(config);
  }

  private logSuccessfulTransaction(songIds, orderId) {
    let params = {
      user_id: this.userId,
      song_ids: songIds,
      transaction_id: orderId,
    }
    this.http.post(this.baseUrl + '/transactions', params).subscribe((data) => {
      this.router.navigate(['downloads']);
    });
  }
}
