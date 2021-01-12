import { Component, OnInit, Input, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Item } from "../../item";
import { MusicService } from "../../services/music.service";
import { CartItemsService } from "../../services/cart-items.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: Array<Item>;
  cart = [];
  cartSongs = [];
  cartTotal: string;
  cartFee: string;
  songs;

  constructor(
    private musicService: MusicService,
    private dialogRef: MatDialogRef<CartComponent>,
    private payDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) song,
    private cartItemsService: CartItemsService,
  ) {}

  ngOnInit(): void {
    this.cartItemsService.getCartItems().subscribe((value) => {
      this.cartItems = value;
    });

    this.cartItemsService.getCartSongs().subscribe((value) => {
      this.cartSongs = value;
    });

    this.cartItemsService.getCartTotal().subscribe((value) => {
      this.cartTotal = value;
    });

    this.cartItemsService.getCartFee().subscribe((value) => {
      this.cartFee = value;
    });
  }

  close() {
    this.dialogRef.close();
  }

  getArtist(song) {
    return this.cartItemsService.getArtistName(song);
  }

  getSongTotal(song, cartItem) {
    return "$" + this.cartItemsService.getSongTotal(song, cartItem);
  }

  getCartTotal() {
    return this.cartTotal;
  }

  getCartFee() {
    return this.cartFee;
  }

}
