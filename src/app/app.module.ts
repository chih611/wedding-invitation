import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { SplashComponent } from './splash/splash.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, FormsModule, SplashComponent, MainComponent],
  providers: [provideAnimations()],
  bootstrap: [App],
})
export class AppModule {}
