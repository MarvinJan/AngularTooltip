import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InformationComponent } from "./components/information/information.component";
import { GalleryComponent } from "./components/gallery/gallery.component";

const routes: Routes = [
  { path: "", component: InformationComponent },
  { path: "gallery", component: GalleryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
