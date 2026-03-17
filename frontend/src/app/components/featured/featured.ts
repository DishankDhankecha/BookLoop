import { Component, inject, OnInit, signal } from '@angular/core';
import { Book } from '../../services/book';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured',
  imports: [CommonModule],
  templateUrl: './featured.html',
  styleUrl: './featured.css',
})
export class Featured implements OnInit{
  private bookService = inject(Book);
  private authService = inject(Auth);
  private router = inject(Router);

  trendingBooks = signal<any[]>([]);

  ngOnInit() {
    this.bookService.getPublicBooks().subscribe({
      next: (books) => {
        const shuffled = books.sort(() => 0.5 - Math.random());
        this.trendingBooks.set(shuffled.slice(0, 4));
      },
      error: (err) => console.error(err)
    });
  }

  handleBookClick() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
