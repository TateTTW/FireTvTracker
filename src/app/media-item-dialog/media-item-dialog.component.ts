import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {MediaItemDetails} from "../interfaces/media-item-details";
import {User} from "firebase/auth";
import {FireService} from "../fire.service";
import {ComboBoxComponent} from "@syncfusion/ej2-angular-dropdowns";
import {Subscription} from "rxjs";

@Component({
  selector: 'media-item-dialog',
  templateUrl: './media-item-dialog.component.html',
  styleUrls: ['./media-item-dialog.component.less']
})
export class MediaItemDialogComponent implements OnInit, OnDestroy {
  @ViewChild(DialogComponent) private dialog?: DialogComponent;
  @ViewChild(ComboBoxComponent) private folders?: ComboBoxComponent;

  @Output() showSpinner: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideSpinner: EventEmitter<any> = new EventEmitter<any>();

  details?: MediaItemDetails;

  private foldersSub?: Subscription;

  get user(): User | null {
    return this.fireService.user;
  }

  get height(): string {
    return window.innerHeight <= 800 ? "100%" : "auto";
  }

  get poster(): string {
    return this.details?.Poster && this.details?.Poster != "N/A" ? this.details?.Poster : "assets/images/noImage.png"
  }

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.foldersSub?.unsubscribe();
  }

  hide() {
    this.dialog?.hide();
    this.foldersSub?.unsubscribe();
  }

  show(details: MediaItemDetails) {
    if (!details.folder && this.user) {
      this.getFolders();
    }
    this.details = details;
    this.dialog?.show();
  }

  async save(folder: string | number | boolean) {
    if (this.details) {
      const mediaItem = {
        Poster: this.details.Poster,
        Title: this.details.Title,
        Type: this.details.Type,
        Year: this.details.Year,
        imdbID: this.details.imdbID,
        folder: folder?.toString() ?? "Folder"
      }

      this.showSpinner.emit();
      await this.fireService.saveMediaItem(mediaItem);
      this.hideSpinner.emit();

      this.dialog?.hide();
    }
  }

  async delete() {
    if (this.details) {
      this.showSpinner.emit();
      await this.fireService.delete(this.details);
      this.hideSpinner.emit();

      this.dialog?.hide();
    }
  }

  private getFolders() {
    this.foldersSub = this.fireService.getFolders()?.subscribe(docs => {
      if (this.folders) {
        this.folders.dataSource = docs.map(doc => doc.payload.doc.id);
      }
    });
  }
}
