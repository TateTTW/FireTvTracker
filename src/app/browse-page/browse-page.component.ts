import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ImdbService} from "../imdb.service";
import {DashboardLayoutComponent} from "@syncfusion/ej2-angular-layouts";
import {MediaResponse} from "../interfaces/media-response";
import {MediaItemDialogComponent} from "../media-item-dialog/media-item-dialog.component";

@Component({
  selector: 'browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.less']
})
export class BrowsePageComponent implements OnInit, AfterViewInit {
  @ViewChild(DashboardLayoutComponent) private dashboard?: DashboardLayoutComponent;
  @ViewChild(MediaItemDialogComponent) private dialog?: MediaItemDialogComponent;

  @Output() showSpinner: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideSpinner: EventEmitter<any> = new EventEmitter<any>();

  response: MediaResponse = { Search: [], totalResults: '0', Response: 'True'}

  constructor(private imdbService: ImdbService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.search({ text: "Movie", isMovie: true });
  }

  async search(param: { text: string; isMovie: boolean }) {
    const type = param.isMovie ? 'movie' : 'series';
    try {
      this.response = await this.imdbService.browse(param.text, type, 1).toPromise();
      this.buildPanels(this.response);
    } catch (e) {
      console.log(e);
    }
  }

  private buildPanels(response: MediaResponse) {
    this.dashboard?.removeAll();

    let row = 0;
    let col = 0;

    for (let item of response.Search ?? []) {
      if (col > 4) {
        col = 0;
        row += 1;
      }

      this.dashboard?.addPanel(
        { "sizeX": 1, "sizeY": 1, "row": row, "col": col++, "content": `<img id="${item.imdbID}" class="mediaItem" src="${item.Poster}"/>` }
      );
      const element = document.getElementById(item.imdbID);
      if (element) {
        element.addEventListener('click', this.openDialog.bind(this));
      }
    }
  }

  async openDialog(event: any) {
    const details = await this.imdbService.getDetails(event.target.id).toPromise();
    this.dialog?.show(details);
  }
}
