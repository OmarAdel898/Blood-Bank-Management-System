import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { whatWeDo } from './what-we-do/what-we-do';

import { State } from './state/state';

@Component({
  selector: 'app-home',
  imports: [Hero, State, whatWeDo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
