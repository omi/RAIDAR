import { BrowserModule } from "@angular/platform-browser";

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxPayPalModule } from "ngx-paypal";

import { MaterialModule } from "./material/material.module";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

import { LoginService } from "./services/login.service";
import { MusicService } from "./services/music.service";
import { CartItemsService } from "./services/cart-items.service";

import { HeaderComponent } from "./components/header/header.component";
import { LoginComponent } from "./components/login/login.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { PlayerComponent } from "./components/player/player.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { NgxAudioPlayerModule } from "ngx-audio-player";
import { KeysPipe } from "./keys.pipe";
import { FilterPipeModule } from "ngx-filter-pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TagInputModule } from "ngx-chips";

import { EduTopicListComponent } from "./components/edu-topic-list/edu-topic-list.component";
import { EduTermListComponent } from "./components/edu-term-list/edu-term-list.component";
import { EduTopicComponent } from "./components/edu-topic/edu-topic.component";
import { EduTopicDialogComponent } from "./components/edu-topic/edu-topic.component";
import { EduTermComponent } from "./components/edu-term/edu-term.component";
import { EditsongComponent } from "./components/editsong/editsong.component";
import { SongComponent } from "./components/song/song.component";
import { DownloadsComponent } from "./components/mydownloads/mydownloads.component";
import { TaglistComponent } from "./components/taglist/taglist.component";
import { DisableControlDirective } from "./directives/disablecontrol";
import {
  SearchComponent,
  SearchService,
} from "./components/search/search.component";
import { PlayerdetailComponent } from "./components/playerdetail/playerdetail.component";
import { MessageService } from "./services/message.serice";
import { CartComponent } from "./components/cart/cart.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { SongDetailComponent } from "./components/song-detail/song-detail.component";
import { SearchResultComponent } from "./components/search-result/search-result.component";
import { DownloadmodalComponent } from "./components/downloadmodal/downloadmodal.component";
// import * as elasticsearch from 'elasticsearch-browser';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "581571792454-clf7t3q216a3eevdmth5676gtl6rhdta.apps.googleusercontent.com"
    ),
  },
]);

export function provideConfig() {
  return config;
}

// private client: Client;
//   private connect() {
//     this.client = new Client({
//       host: 'http://localhost:9200',
//       log: 'trace'
//     });
//   }

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PagenotfoundComponent,
    HomeComponent,
    RegisterComponent,
    PlayerComponent,
    ProfileComponent,
    DisableControlDirective,
    KeysPipe,
    EduTopicListComponent,
    EduTermListComponent,
    EduTopicComponent,
    EduTopicDialogComponent,
    EduTermComponent,
    EditsongComponent,
    SongComponent,
    TaglistComponent,
    SearchComponent,
    PlayerdetailComponent,
    CartComponent,
    PaymentComponent,
    DownloadsComponent,
    SongDetailComponent,
    SearchResultComponent,
    DownloadmodalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    BrowserAnimationsModule,
    TagInputModule,
    FilterPipeModule,
    SocialLoginModule,
    MaterialModule,
    NgxAudioPlayerModule,
    FontAwesomeModule,
    NgxPayPalModule,
  ],
  exports: [DisableControlDirective],

  entryComponents: [
    EditsongComponent,
    EduTopicDialogComponent,
    DownloadmodalComponent,
  ],
  providers: [
    MusicService,
    HttpErrorHandler,
    MessageService,
    { provide: MAT_DIALOG_DATA, useValue: { hasBackdrop: false } },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    { provide: "googleTagManagerId", useValue: "GTM-PPBJ8GQ" },
    LoginService,
    SearchService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
