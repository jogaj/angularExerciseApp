import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: SetupComponent },
  { path: 'main', component: MainComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
