import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  startReport() {
    this.router.navigate(['/add'], { queryParams: { includeConstruct: true } });
  }

  startReportWithoutConstruct() {
    this.router.navigate(['/add'], { queryParams: { includeConstruct: false } });
  }

}
