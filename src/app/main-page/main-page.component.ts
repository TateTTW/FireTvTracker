import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "firebase/auth";
import {FireService} from "../fire.service";
import {createSpinner, hideSpinner, showSpinner} from "@syncfusion/ej2-angular-popups";
import {TabComponent} from "@syncfusion/ej2-angular-navigations";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {
  @ViewChild(TabComponent) private tabs?: TabComponent;

  selectedIndex = 1;

  get user(): User | null {
    return this.fireService.user;
  }

  constructor(private fireService: FireService) { }

  ngOnInit(): void {

  }

  async login() {
    this.fireService.login();
  }

  showSpinner() {
    const spinnerTarget = document.querySelector('#spinnerDiv') as HTMLElement;
    if (!this.spinnerExist()) {
      createSpinner({ target:spinnerTarget, width: '70px' });
    }
    showSpinner(spinnerTarget);
  }

  hideSpinner() {
    if (this.spinnerExist()) {
      const spinnerTarget = document.querySelector('#spinnerDiv') as HTMLElement;
      hideSpinner(spinnerTarget);
    }
  }

  private spinnerExist(): boolean {
    const spinnerTarget = document.querySelector('#spinnerDiv') as HTMLElement;
    const style = Array.from(spinnerTarget.children).reduce((acc: string[], node) => {
      node.classList.forEach(style => acc.push(style));
      return acc;
    }, []);
    return style.includes("e-spinner-pane");
  }

  selected(event: any) {
    this.tabs?.enableTab(0, false);
    this.selectedIndex = event.selectedIndex;
  }

  selecting() {
    this.tabs?.enableTab(0, true);
  }
}
