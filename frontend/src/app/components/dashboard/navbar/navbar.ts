import { Component, inject, signal } from '@angular/core';
import { Exchange } from '../../../services/exchange';
import { Book } from '../../../services/book';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule , RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
private authService = inject(Auth);
  private exchangeService = inject(Exchange);
  private bookService = inject(Book);

  userAvatar = signal<string | null>(null);
  recentNotifications = signal<any[]>([]);
  hasUnread = signal<boolean>(false);
  isDropdownOpen = signal<boolean>(false);

  ngOnInit() {
    const userId = localStorage.getItem('_id');
    if (userId) {
      this.authService.getUserProfile(userId).subscribe({
        next: (user: any) => {
          if (user.avatar) {
            this.userAvatar.set(user.avatar);
          }
          this.loadNotifications(userId, user.preferences || []);
        }
      });
    }
  }

  loadNotifications(userId: string, preferences: string[]) {
    let allAlerts: any[] = [];

    this.exchangeService.getIncomingRequests().subscribe({
      next: (incoming) => {
        incoming.forEach(req => {
          if (req.status === 'Pending') {
            allAlerts.push({
              id: req._id,
              type: 'Action Required',
              message: `@${req.requester?.username} requested to borrow "${req.book?.title}".`,
              timestamp: new Date(req.createdAt).getTime()
            });
          }
        });
        this.finalizeNotifications(allAlerts);
      }
    });

    this.exchangeService.getOutgoingRequests().subscribe({
      next: (outgoing) => {
        outgoing.forEach(req => {
          if (req.status === 'Accepted') {
            allAlerts.push({
              id: req._id,
              type: 'Request Approved',
              message: `@${req.owner?.username} accepted your request for "${req.book?.title}".`,
              timestamp: new Date(req.updatedAt).getTime()
            });
          } else if (req.status === 'Declined') {
            allAlerts.push({
              id: req._id,
              type: 'Request Declined',
              message: `@${req.owner?.username} declined your request for "${req.book?.title}".`,
              timestamp: new Date(req.updatedAt).getTime()
            });
          }
        });
        this.finalizeNotifications(allAlerts);
      }
    });

    if (preferences.length > 0) {
      this.bookService.getAllBooks().subscribe({
        next: (books) => {
          const recentMatches = books
            .filter(b => b.owner && b.owner._id !== userId && b.status === 'Available')
            .filter(b => preferences.includes(b.genre))
            .slice(-5);

          recentMatches.forEach(book => {
            allAlerts.push({
              id: book._id,
              type: 'New Match',
              message: `@${book.owner.username} listed a new ${book.genre} volume: "${book.title}".`,
              timestamp: new Date(book.createdAt || Date.now()).getTime()
            });
          });
          this.finalizeNotifications(allAlerts);
        }
      });
    }
  }

  private finalizeNotifications(alerts: any[]) {
    const sorted = alerts.sort((a, b) => b.timestamp - a.timestamp);
    if (sorted.length > 0) {
      this.hasUnread.set(true);
    }
    this.recentNotifications.set(sorted.slice(0, 3));
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
    if (this.isDropdownOpen()) {
      this.hasUnread.set(false);
    }
  }
}
