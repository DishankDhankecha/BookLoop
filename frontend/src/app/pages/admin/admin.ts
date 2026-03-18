import { Component, inject, signal, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { Admin as AdminService} from '../../services/admin';
import { Book } from '../../services/book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  
  private adminService = inject(AdminService);
  private authService = inject(Auth);
  private bookService = inject(Book);
  private router = inject(Router);

  activeTab = signal<'overview' | 'users' | 'books' | 'exchanges' | 'queue'>('overview');
  isLoading = signal(true);

  users = signal<any[]>([]);
  books = signal<any[]>([]);
  exchanges = signal<any[]>([]);
  pendingBooks = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
    this.loadPendingBooks();
  }

  loadData() {
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.users.set(data.users);
        this.books.set(data.books);
        this.exchanges.set(data.exchanges);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  loadPendingBooks() {
    this.bookService.getPendingBooks().subscribe({
      next: (books) => this.pendingBooks.set(books),
      error: (err) => console.error(err)
    });
  }

  handleReview(id: string, action: 'approve' | 'reject') {
    this.bookService.reviewBook(id, action).subscribe({
      next: () => {
        this.pendingBooks.update(books => books.filter(b => b._id !== id));
        this.loadData();
      },
      error: (err) => alert('Action failed.')
    });
  }

  deleteUser(id: string) {
    if (confirm('Permanently delete this user from the platform?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => this.loadData(),
        error: (err) => alert(err.error?.message || 'Failed to delete user')
      });
    }
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}