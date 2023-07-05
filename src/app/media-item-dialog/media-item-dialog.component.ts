import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DialogComponent} from "@syncfusion/ej2-angular-popups";
import {MediaItemDetails} from "../interfaces/media-item-details";
import {User} from "firebase/auth";
import {FireService} from "../fire.service";

@Component({
  selector: 'media-item-dialog',
  templateUrl: './media-item-dialog.component.html',
  styleUrls: ['./media-item-dialog.component.less']
})
export class MediaItemDialogComponent implements OnInit {
  @ViewChild(DialogComponent) private dialog?: DialogComponent;

  @Output() showSpinner: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideSpinner: EventEmitter<any> = new EventEmitter<any>();

  details?: MediaItemDetails;

  get user(): User | null {
    return this.fireService.user;
  }

  get poster(): string {
    return this.details?.Poster ?? "assets/images/noImage.png"
  }

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
  }

  hide() {
    this.dialog?.hide();
  }

  show(details: MediaItemDetails) {
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
        folder: folder.toString()
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
}
