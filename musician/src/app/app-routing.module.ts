import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { HomeComponent } from "./home/home.component";
import { UploadComponent } from "./components/upload/upload.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { EduTopicListComponent } from "./components/edu-topic-list/edu-topic-list.component";
import { EduTermListComponent } from "./components/edu-term-list/edu-term-list.component";
import { PlayerComponent } from "./components/player/player.component";
import { PlayerdetailComponent } from "./components/playerdetail/playerdetail.component";

const routes: Routes = [
  { path: "", component: HomeComponent },

  { path: "profile", component: ProfileComponent },
  { path: "education", component: EduTopicListComponent },
  { path: "glossary", component: EduTermListComponent },
  { path: "upload", component: UploadComponent },
  { path: "audio-library", component: PlayerComponent },
  { path: "audio-library/:id", component: PlayerComponent },

  { path: "**", component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
