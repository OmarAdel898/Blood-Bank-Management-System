import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { whatWeDo } from './what-we-do/what-we-do';

import { State } from './state/state';
import { HowItWorks } from './how-it-works/how-it-works';

@Component({
  selector: 'app-home',
  imports: [Hero, State, whatWeDo,HowItWorks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
