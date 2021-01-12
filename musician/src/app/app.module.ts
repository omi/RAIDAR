import { BrowserModule } from "@angular/platform-browser";

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpErrorHandler } from "src/app/services/http-error.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MaterialModule } from "./material/material.module";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

import { LoginService } from "./services/login.service";
import { MusicService } from "./services/music.service";
import { HeaderComponent } from "./components/header/header.component";

import { LoginComponent } from "./components/login/login.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { UploadComponent } from "./components/upload/upload.component";
import { PlayerComponent } from "./components/player/player.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { NgxAudioPlayerModule } from "ngx-audio-player";
import { KeysPipe } from "./keys.pipe";
import { FilterPipeModule } from "ngx-filter-pipe";
import { OrderModule } from "ngx-order-pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TagInputModule } from "ngx-chips";

import { EduTopicListComponent } from "./components/edu-topic-list/edu-topic-list.component";
import { EduTermListComponent } from "./components/edu-term-list/edu-term-list.component";
import { EduTopicComponent } from "./components/edu-topic/edu-topic.component";
import { EduTopicDialogComponent } from "./components/edu-topic/edu-topic.component";
import { EduTermComponent } from "./components/edu-term/edu-term.component";
import { EditsongComponent } from "./components/editsong/editsong.component";
import { SongComponent } from "./components/song/song.component";
import { TaglistComponent } from "./components/taglist/taglist.component";
import { DisableControlDirective } from "./directives/disablecontrol";
import { SearchComponent } from "./components/search/search.component";
import { PlayerdetailComponent } from "./components/playerdetail/playerdetail.component";
import { MessageService } from "./services/message.serice";

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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PagenotfoundComponent,
    HomeComponent,
    RegisterComponent,
    UploadComponent,
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
    OrderModule,
    SocialLoginModule,
    MaterialModule,
    NgxAudioPlayerModule,
    FontAwesomeModule,
  ],
  exports: [DisableControlDirective],

  entryComponents: [EditsongComponent, EduTopicDialogComponent],
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
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
