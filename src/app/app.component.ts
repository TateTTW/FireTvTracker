import { Component } from '@angular/core';
import {initializeApp} from "@angular/fire/app";

  const app = initializeApp

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'TvTracker';
}
