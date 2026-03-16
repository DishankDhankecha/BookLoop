import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private authService = inject(Auth);

  userCount = signal(0);
  bookCount = signal(0);
  exchangeCount = signal(0);

  ngOnInit() {
    this.authService.getGlobalStats().subscribe({
      next: (stats: any) => {
        this.userCount.set(stats.users);
        this.bookCount.set(stats.books);
        this.exchangeCount.set(stats.exchanges);
      },
      error: (err) => console.error('Error fetching stats', err)
    });
  }
}
