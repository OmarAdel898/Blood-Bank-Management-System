import { Component, ElementRef, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMobileMenuOpen = signal(false);

  links = [
    { text: 'Home', route: '/' },
    { text: 'Donate Now', route: '/donate' },
    { text: 'Blood Bank', route: '/blood-bank' },
    { text: 'About', route: '/about' },
  ];
  constructor(private elRef: ElementRef) {
    // إغلاق المينو عند الضغط خارج الـ navbar
    effect(() => {
      let handleClickOutside: (event: MouseEvent) => void;

      if (this.isMobileMenuOpen()) {
        handleClickOutside = (event: MouseEvent) => {
          if (!this.elRef.nativeElement.contains(event.target)) {
            this.isMobileMenuOpen.set(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
      }

      // Return cleanup function always
      return () => {
        if (handleClickOutside) {
          document.removeEventListener('click', handleClickOutside);
        }
      };
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }
}
