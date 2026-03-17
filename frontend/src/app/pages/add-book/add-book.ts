import { Component, inject, signal } from '@angular/core';
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  imports: [Sidebar, Navbar, CommonModule, FormsModule],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})

export class AddBook {
  private bookService = inject(Book);
  private router = inject(Router);

  isSubmitting = signal(false);

  availableGenres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Design', 'Architecture', 'Typography', 'Technology', 'Art'
  ];

  bookData = {
    title: '',
    author: '',
    isbn: '',
    condition: 'Like New',
    genre: [] as string[],
    images: [] as string[],
    imageUrl: ''
  };

  imagePreview = signal<string | null>(null);

  toggleGenre(genre: string) {
    const index = this.bookData.genre.indexOf(genre);
    if (index > -1) {
      this.bookData.genre.splice(index, 1);
    } else {
      this.bookData.genre.push(genre);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview.set(base64String);
        this.bookData.images = [base64String];
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.bookData.genre.length === 0) {
      alert("Please select at least one genre.");
      return;
    }

    this.isSubmitting.set(true);

    this.bookService.createBook(this.bookData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/my-library']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        alert(err.error?.message || 'Failed to list book.');
      }
    });
  }
}
