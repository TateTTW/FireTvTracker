import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { DashboardLayoutModule } from "@syncfusion/ej2-angular-layouts";
import { TextBoxModule } from "@syncfusion/ej2-angular-inputs";
import { ButtonModule, RadioButtonModule } from "@syncfusion/ej2-angular-buttons";
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

import {MainPageComponent} from "./main-page/main-page.component";
import {SavedPageComponent} from "./saved-page/saved-page.component";
import {BrowsePageComponent} from "./browse-page/browse-page.component";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {DialogModule} from "@syncfusion/ej2-angular-popups";
import { MediaItemDialogComponent } from './media-item-dialog/media-item-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    BrowsePageComponent,
    SavedPageComponent,
    MediaItemDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TabModule,
    DashboardLayoutModule,
    TextBoxModule,
    ButtonModule,
    RadioButtonModule,
    ComboBoxModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    DialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
