import {Component, OnInit} from '@angular/core';
import {User} from "firebase/auth";
import {FireService} from "../fire.service";
import {createSpinner, hideSpinner, showSpinner} from "@syncfusion/ej2-angular-popups";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  selectedIndex = 1;

  text = "Movie";
  isMovie = true;
  page = 1;

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
    this.selectedIndex = event.selectedIndex;
  }

  selecting(event: any) {
    if (!this.user && event.selectingIndex == 1) {
      event.cancel = true;
    }
    console.log(event);
  }
}
