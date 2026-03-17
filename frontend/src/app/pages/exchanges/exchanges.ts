import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { CommonModule } from '@angular/common';
import { Exchange } from '../../services/exchange';
import { Book } from '../../services/book';

@Component({
  selector: 'app-exchanges',
  imports: [Navbar, Sidebar, CommonModule],
  templateUrl: './exchanges.html',
  styleUrl: './exchanges.css',
})
export class Exchanges implements OnInit {
  private exchangeService = inject(Exchange);
  private bookService = inject(Book);

  incomingRequests = signal<any[]>([]);
  outgoingRequests = signal<any[]>([]);
  allBooksDictionary = signal<any[]>([]);

  currentView = signal<'active' | 'history'>('active');

  activeIncoming = computed(() => this.incomingRequests().filter(req => req.status === 'Pending' || req.status === 'Accepted'));
  historyIncoming = computed(() => this.incomingRequests().filter(req => req.status === 'Completed' || req.status === 'Declined'));

  activeOutgoing = computed(() => this.outgoingRequests().filter(req => req.status === 'Pending' || req.status === 'Accepted'));
  historyOutgoing = computed(() => this.outgoingRequests().filter(req => req.status === 'Completed' || req.status === 'Declined'));

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.allBooksDictionary.set(books);
        this.fetchExchangeData();
      },
      error: () => {
        this.fetchExchangeData();
      }
    });
  }

  fetchExchangeData() {
    this.exchangeService.getIncomingRequests().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.requests || response.data || []);
        this.incomingRequests.set(this.syncBookImages(data));
      },
      error: (err) => console.error(err)
    });

    this.exchangeService.getOutgoingRequests().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.requests || response.data || []);
        this.outgoingRequests.set(this.syncBookImages(data));
      },
      error: (err) => console.error(err)
    });
  }

  syncBookImages(requests: any[]) {
    const books = this.allBooksDictionary();
    if (!books.length) return requests;

    return requests.map(req => {
      if (req.book && req.book._id) {
        const matchingBook = books.find(b => b._id === req.book._id);
        if (matchingBook && matchingBook.imageUrl) {
          req.book.imageUrl = matchingBook.imageUrl;
        }
      }
      return req;
    });
  }

  updateStatus(id: string, status: string) {
    this.exchangeService.updateRequestStatus(id, status).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to update status');
      }
    });
  }

  cancelRequest(id: string) {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.exchangeService.deleteExchangeRequest(id).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to cancel request');
        }
      });
    }
  }
}