import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Book } from '../../services/book';

@Component({
  selector: 'app-my-library',
  imports: [Navbar, Sidebar, CommonModule, FormsModule, RouterLink],
  templateUrl: './my-library.html',
  styleUrl: './my-library.css',
})

export class MyLibrary implements OnInit {
  private bookService = inject(Book);

  myBooks = signal<any[]>([]);
  editingBook = signal<any | null>(null);

  searchQuery = signal('');
  selectedStatus = signal('All');
  selectedCondition = signal('All');

  filteredBooks = computed(() => {
    let books = this.myBooks();
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    const condition = this.selectedCondition();

    if (query) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.isbn && book.isbn.includes(query))
      );
    }

    if (status !== 'All') {
      books = books.filter(book => book.status === status);
    }

    if (condition !== 'All') {
      books = books.filter(book => book.condition === condition);
    }

    return books;
  });

  ngOnInit() {
    this.loadMyBooks();
  }

  loadMyBooks() {
    const userId = localStorage.getItem('_id');
    if (userId) {
      this.bookService.getUserBooks(userId).subscribe({
        next: (response: any) => {
          const booksArray = Array.isArray(response) ? response : (response.booksListed || response.books || []);
          this.myBooks.set(booksArray);
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteBook(id: string) {
    if (confirm('Are you sure you want to permanently delete this listing?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.myBooks.update(books => books.filter(b => b._id !== id));
        },
        error: (err) => alert('Failed to delete book.')
      });
    }
  }

  openEdit(book: any) {
    this.editingBook.set({ ...book });
  }

  closeEdit() {
    this.editingBook.set(null);
  }

  saveEdit() {
    const book = this.editingBook();
    if (book) {
      this.bookService.updateBook(book._id, book).subscribe({
        next: (updatedBook) => {
          this.myBooks.update(books =>
            books.map(b => b._id === updatedBook._id ? updatedBook : b)
          );
          this.closeEdit();
        },
        error: (err) => alert('Failed to update book.')
      });
    }
  }
}