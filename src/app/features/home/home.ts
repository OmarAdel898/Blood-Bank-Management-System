import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { State } from './state/state';

@Component({
  selector: 'app-home',
  imports: [Hero ,State],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
