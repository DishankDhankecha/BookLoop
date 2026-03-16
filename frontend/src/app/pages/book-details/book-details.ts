import { Component, inject, signal } from '@angular/core';
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Book } from '../../services/book';
import { Exchange } from '../../services/exchange';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details',
  imports: [ Navbar, RouterLink , CommonModule , RouterLink],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css',
})
export class BookDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(Book);
  private exchangeService = inject(Exchange);

  book = signal<any>(null);
  isLoading = signal(true);
  currentUserId = signal<string | null>(null);

  ngOnInit() {
    this.currentUserId.set(localStorage.getItem('_id'));
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
    }
  }

  loadBook(id: string) {
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.router.navigate(['/browse']);
      }
    });
  }

  requestExchange() {
    const currentBook = this.book();
    if (!currentBook) return;

    this.exchangeService.requestExchange(currentBook._id).subscribe({
      next: () => {
        alert('Exchange request sent successfully!');
        this.router.navigate(['/exchanges']);
      },
      error: (err) => alert(err.error?.message || 'Failed to send exchange request.')
    });
  }
}
