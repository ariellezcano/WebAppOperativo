import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number;
  constructor() { 
    this.currentYear = moment().year(); // devuelve number, p.ej. 2025
  }

  ngOnInit(): void {
  }

}
