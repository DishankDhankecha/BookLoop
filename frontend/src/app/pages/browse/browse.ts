import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../services/book';
import { Exchange } from '../../services/exchange';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-browse',
  imports: [Sidebar, Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './browse.html',
  styleUrl: './browse.css',
})

export class Browse implements OnInit {
    private bookService = inject(Book);
  private exchangeService = inject(Exchange);

  searchQuery = signal('');
  selectedGenres = signal<string[]>([]);
  selectedCondition = signal('All');

  availableBooks = signal<any[]>([]);

  availableGenresList = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Design', 'Architecture', 'Typography', 'Technology', 'Art'
  ];

  currentPage = signal(1);
  itemsPerPage = 8;

  constructor() {
    effect(() => {
      this.searchQuery();
      this.selectedGenres();
      this.selectedCondition();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        const currentUserId = localStorage.getItem('_id');

        const publicBooks = books
          .filter(book => book.owner && book.owner._id !== currentUserId && book.status === 'Available')
          .map(book => ({
            _id: book._id,
            title: book.title,
            author: book.author,
            isbn: book.isbn || '',
            owner: book.owner.username,
            condition: book.condition,
            genre: Array.isArray(book.genre) ? book.genre : [book.genre].filter(Boolean),
            imageUrl: book.images && book.images.length > 0 ? book.images[0] : null
          }));

        this.availableBooks.set(publicBooks);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleGenreFilter(genre: string) {
    const current = this.selectedGenres();
    if (current.includes(genre)) {
      this.selectedGenres.set(current.filter(g => g !== genre));
    } else {
      this.selectedGenres.set([...current, genre]);
    }
  }

  filteredBooks = computed(() => {
    let books = this.availableBooks();
    const query = this.searchQuery().toLowerCase();
    const genres = this.selectedGenres();
    const condition = this.selectedCondition();

    if (query) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      );
    }

    if (genres.length > 0) {
      books = books.filter(book =>
        book.genre.some((g: string) => genres.includes(g))
      );
    }

    if (condition !== 'All') {
      books = books.filter(book => book.condition === condition);
    }

    return books;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredBooks().length / this.itemsPerPage) || 1;
  });

  paginatedBooks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBooks().slice(startIndex, endIndex);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  requestExchange(bookId: string) {
    this.exchangeService.requestExchange(bookId).subscribe({
      next: () => {
        alert('Exchange request sent successfully!');
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to send exchange request.');
      }
    });
  }
}
