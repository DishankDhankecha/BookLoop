import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink , RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule , RouterLink , RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;

  isLoggedIn = false; 
  
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Best Sellers', path: '/best-sellers' },
    { label: 'About', path: '/about' }
  ];

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
