import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Auth, getRedirectResult} from "@angular/fire/auth";
import {User} from "firebase/auth";
import {MediaItem} from "./interfaces/media-item";
import {Observable, Subject} from "rxjs";
import {DocumentChangeAction} from "@angular/fire/compat/firestore/interfaces";

@Injectable({
  providedIn: 'root'
})
export class FireService {
  user = this.auth.currentUser;

  prevFolders: string[] = [];
  folders = new Subject<string[]>();

  loaded?: Promise<any>;

  constructor(private auth: Auth, private store: AngularFirestore) {
    this.loaded = this.initUser();
  }

  getFolders(): Observable<DocumentChangeAction<any>[]> | void {
    if (this.user) {
      return this.store.collection("users").doc(this.user.uid).collection("folders").snapshotChanges()
    }
  }

  getMediaItems(folder: string): Observable<DocumentChangeAction<any>[]> | void {
    if (this.user) {
      return this.store.collection("users").doc(this.user.uid).collection("folders").doc(folder).collection(folder).snapshotChanges();
    }
  }

  async saveMediaItem(mediaItem: MediaItem) {
    if (this.user) {
      const folders = await this.store.collection("users").doc(this.user.uid).collection("folders");
      folders.doc(mediaItem.folder).set({name: mediaItem.folder});
      folders.doc(mediaItem.folder).collection(mediaItem.folder).doc(JSON.stringify({imdbID: mediaItem.imdbID, poster: encodeURIComponent(mediaItem.Poster)})).set(mediaItem);
    }
  }

  async delete(mediaItem: MediaItem) {
    if (this.user) {
      const folders = await this.store.collection("users").doc(this.user.uid).collection("folders");
      folders.doc(mediaItem.folder).collection(mediaItem.folder).doc(JSON.stringify({imdbID: mediaItem.imdbID, poster: encodeURIComponent(mediaItem.Poster)})).delete();
    }
  }

  async deleteFolder(folder: string) {
    if (this.user) {
      await this.store.collection("users").doc(this.user.uid).collection("folders").doc(folder).delete();
    }
  }

  private async initUser() {
    const result = await getRedirectResult(this.auth);
    if (result?.user) {
      this.user = result.user;
    }

    if (this.user) {
      await this.saveUser(this.user);
    }
  }

  private async saveUser(user: User) {
    try {
      await this.store.collection("users").doc(user.uid).set({
        name: user.displayName,
        uid: user.uid,
        email: user.email
      });
    } catch (e) {
      console.error(e);
    }
  }
}
