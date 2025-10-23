import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { whatWeDo } from './what-we-do/what-we-do';

@Component({
  selector: 'app-home',
  imports: [Hero, whatWeDo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
