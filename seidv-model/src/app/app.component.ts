import { Component } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'seidv-model';
  
  constructor(private router: Router) {}

  public goHome() {
    this.router.navigateByUrl('/home');
  }
}
