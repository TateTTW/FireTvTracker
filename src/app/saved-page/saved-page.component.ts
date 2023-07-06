import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ImdbService} from "../imdb.service";
import {DashboardLayoutComponent} from "@syncfusion/ej2-angular-layouts";
import {FireService} from "../fire.service";
import {Subscription} from "rxjs";
import {DialogUtility} from "@syncfusion/ej2-popups";
import {MediaItemDialogComponent} from "../media-item-dialog/media-item-dialog.component";

@Component({
  selector: 'saved-page',
  templateUrl: './saved-page.component.html',
  styleUrls: ['./saved-page.component.less']
})
export class SavedPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DashboardLayoutComponent) private dashboard?: DashboardLayoutComponent;
  @ViewChild(MediaItemDialogComponent) private dialog?: MediaItemDialogComponent;

  @Output() showSpinner: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideSpinner: EventEmitter<any> = new EventEmitter<any>();

  folder?: string;

  readonly cols = 5;
  readonly maxCol = this.cols - 1;

  private foldersSub?: Subscription;
  private mediaItemsSub?: Subscription;

  constructor(private fireService: FireService, private imdbService: ImdbService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.foldersSub?.unsubscribe();
    this.mediaItemsSub?.unsubscribe();
  }

  deleteFolder() {
    const dialog = DialogUtility.confirm({
      title: "Confirm",
      content: "Are you sure you want to delete this folder and all of it's contents?",
      okButton: {
        text: "Yes",
        click: async () => {
          if (this.folder) {
            this.showSpinner.emit();
            await this.fireService.deleteFolder(this.folder);
            this.hideSpinner.emit();
            this.folderNav();
          }
          dialog.close();
        }
      },
      showCloseIcon: true
    });
  }

  async dashCreated() {
    await this.fireService.loaded;
    this.getFolders();
  }

  folderNav() {
    this.folder = undefined;
    this.mediaItemsSub?.unsubscribe();
    this.getFolders();
  }

  private getFolders() {
    this.foldersSub = this.fireService.getFolders()?.subscribe(docs => {
      const folders = docs.map(doc => doc.payload.doc.id);
      this.buildFolders(folders);
    });
  }

  private buildFolders(folders: string[]) {
    this.dashboard?.removeAll();

    let row = 0;
    let col = 0;

    for (let folder of folders) {
      if (col > this.maxCol) {
        col = 0;
        row += 1;
      }

      this.dashboard?.addPanel({
          "sizeX": 1,
          "sizeY": 1,
          "row": row,
          "col": col++,
          "header": `<div>${folder}</div>`,
          "content": `<div id="folder-${folder}" folder="${folder}" class="folder"><i class="far fa-folder-open fa-7x" folder="${folder}"></i></div>`
        });
      const element = document.getElementById(`folder-${folder}`);
      if (element) {
        element.addEventListener('click', this.openFolder.bind(this));
      }
    }
  }

  private openFolder(event: any) {
    this.foldersSub?.unsubscribe();
    const folder = event?.target?.attributes?.folder?.value;
    if (folder) {
      this.folder = folder;
      this.mediaItemsSub = this.fireService.getMediaItems(folder)?.subscribe(docs => {
        const items = docs.map(doc => JSON.parse(doc.payload.doc.id));
        this.buildMediaItems(items);
      });
    }
  }

  private buildMediaItems(items: { imdbID: string, poster: string }[]) {
    this.dashboard?.removeAll();

    let row = 0;
    let col = 0;

    for (let item of items) {
      if (col > this.maxCol) {
        col = 0;
        row += 1;
      }

      const poster = decodeURIComponent(item.poster);
      this.dashboard?.addPanel({
        "sizeX": 1,
        "sizeY": 2,
        "row": row,
        "col": col++,
        "content": `<img id="${this.folder}-${item.imdbID}" imdbID="${item.imdbID}" class="mediaItem" src="${poster}"/>`
      });
      const element = document.getElementById(`${this.folder}-${item.imdbID}`);
      if (element) {
        element.addEventListener('click', this.openDialog.bind(this));
      }
    }
  }

  private async openDialog(event: any) {
    const imdbID = event?.target?.attributes?.imdbID?.value;
    if (imdbID) {
      const details = await this.imdbService.getDetails(imdbID).toPromise();
      details.folder = this.folder;
      this.dialog?.show(details);
    }
  }
}
