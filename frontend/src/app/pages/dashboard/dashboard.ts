import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { Book } from '../../services/book';
import { Exchange } from '../../services/exchange';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Sidebar, FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  private bookService = inject(Book);
  private exchangeService = inject(Exchange);

  username = signal<string>('Reader');

  listedCount = signal<number>(0);
  incomingCount = signal<number>(0);
  outgoingCount = signal<number>(0);
  completedCount = signal<number>(0);

  myRecentBooks = signal<any[]>([]);
  suggestedBooks = signal<any[]>([]);
  recentActivity = signal<any[]>([]);
  actionRequired = signal<any | null>(null);

  ngOnInit() {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      this.username.set(storedName);
    }
    this.loadDashboardData();
  }

  loadDashboardData() {
    const userId = localStorage.getItem('_id');
    let userPreferences: string[] = [];

    if (userId) {
      this.bookService.getUserBooks(userId).subscribe({
        next: (user) => {
          const listed = user.booksListed || [];
          userPreferences = user.preferences || [];
          this.listedCount.set(listed.length);
          this.myRecentBooks.set([...listed].reverse().slice(0, 3));
        }
      });
    }

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        let publicBooks = books.filter(b => b.owner && b.owner._id !== userId && b.status === 'Available');

        if (userPreferences.length > 0) {
          const personalizedBooks = publicBooks.filter(b => userPreferences.includes(b.genre));
          if (personalizedBooks.length > 0) {
            publicBooks = personalizedBooks;
          }
        }

        this.suggestedBooks.set(publicBooks.reverse().slice(0, 3));
      }
    });

    this.exchangeService.getIncomingRequests().subscribe({
      next: (incoming) => {
        const active = incoming.filter(req => req.status !== 'Completed' && req.status !== 'Declined');
        const completed = incoming.filter(req => req.status === 'Completed');

        this.incomingCount.set(active.length);

        const pending = active.find(req => req.status === 'Pending');
        if (pending) {
          this.actionRequired.set(pending);
        }

        this.updateActivityFeed(incoming, 'incoming');
      }
    });

    this.exchangeService.getOutgoingRequests().subscribe({
      next: (outgoing) => {
        const active = outgoing.filter(req => req.status !== 'Completed' && req.status !== 'Declined');
        const completed = outgoing.filter(req => req.status === 'Completed');

        this.outgoingCount.set(active.length);
        this.completedCount.update(count => count + completed.length);

        this.updateActivityFeed(outgoing, 'outgoing');
      }
    });
  }

  private updateActivityFeed(requests: any[], type: 'incoming' | 'outgoing') {
    const formatted = requests.map(req => ({
      ...req,
      type: type,
      timestamp: req.updatedAt || req.createdAt
    }));

    this.recentActivity.update(current => {
      const combined = [...current, ...formatted];
      return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);
    });
  }
}
