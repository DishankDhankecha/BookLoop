import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/dashboard/navbar/navbar';
import { Sidebar } from '../../components/dashboard/sidebar/sidebar';
import { RouterLink } from '@angular/router';
import { Exchange } from '../../services/exchange';
import { Book } from '../../services/book';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})

export class Settings implements OnInit {
    private authService = inject(Auth);
  private exchangeService = inject(Exchange);
  private bookService = inject(Book);

  activeTab = signal<'profile' | 'security' | 'notifications'>('profile');
  isLoading = signal(true);
  isSaving = signal(false);

  userData = {
    username: '',
    email: '',
    avatar: '',
    location: {
      city: '',
      state: ''
    },
    preferences: [] as string[]
  };

  availableGenres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Design', 'Architecture', 'Typography', 'Technology', 'Art'
  ];

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  imagePreview = signal<string | null>(null);
  notifications = signal<any[]>([]);

  ngOnInit() {
    const userId = localStorage.getItem('_id');
    if (userId) {
      this.authService.getUserProfile(userId).subscribe({
        next: (user: any) => {
          this.userData.username = user.username || '';
          this.userData.email = user.email || '';
          this.userData.location.city = user.location?.city || '';
          this.userData.location.state = user.location?.state || '';
          this.userData.avatar = user.avatar || '';
          this.userData.preferences = user.preferences || [];

          if (user.avatar) {
            this.imagePreview.set(user.avatar);
          }
          this.isLoading.set(false);
          this.loadNotifications(userId);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  togglePreference(genre: string) {
    const index = this.userData.preferences.indexOf(genre);
    if (index > -1) {
      this.userData.preferences.splice(index, 1);
    } else {
      this.userData.preferences.push(genre);
    }
  }

  loadNotifications(userId: string) {
    let allAlerts: any[] = [];

    this.exchangeService.getIncomingRequests().subscribe({
      next: (incoming) => {
        incoming.forEach(req => {
          if (req.status === 'Pending') {
            allAlerts.push({
              id: req._id,
              type: 'Action Required',
              message: `@${req.requester?.username} requested to borrow "${req.book?.title}".`,
              date: new Date(req.createdAt).toLocaleDateString(),
              timestamp: new Date(req.createdAt).getTime()
            });
          }
        });
        this.updateNotificationsList(allAlerts);
      }
    });

    this.exchangeService.getOutgoingRequests().subscribe({
      next: (outgoing) => {
        outgoing.forEach(req => {
          if (req.status === 'Accepted') {
            allAlerts.push({
              id: req._id,
              type: 'Request Approved',
              message: `@${req.owner?.username} accepted your request for "${req.book?.title}". Reach out to arrange pickup!`,
              date: new Date(req.updatedAt).toLocaleDateString(),
              timestamp: new Date(req.updatedAt).getTime()
            });
          } else if (req.status === 'Declined') {
            allAlerts.push({
              id: req._id,
              type: 'Request Declined',
              message: `@${req.owner?.username} declined your request for "${req.book?.title}".`,
              date: new Date(req.updatedAt).toLocaleDateString(),
              timestamp: new Date(req.updatedAt).getTime()
            });
          }
        });
        this.updateNotificationsList(allAlerts);
      }
    });

    if (this.userData.preferences.length > 0) {
      this.bookService.getAllBooks().subscribe({
        next: (books) => {
          const recentMatches = books
            .filter(b => b.owner && b.owner._id !== userId && b.status === 'Available')
            .filter(b => this.userData.preferences.includes(b.genre))
            .slice(-5);

          recentMatches.forEach(book => {
            allAlerts.push({
              id: book._id,
              type: 'New Match',
              message: `@${book.owner.username} just listed a new ${book.genre} volume: "${book.title}".`,
              date: new Date(book.createdAt || Date.now()).toLocaleDateString(),
              timestamp: new Date(book.createdAt || Date.now()).getTime()
            });
          });
          this.updateNotificationsList(allAlerts);
        }
      });
    }
  }

  private updateNotificationsList(alerts: any[]) {
    const sorted = alerts.sort((a, b) => b.timestamp - a.timestamp);
    this.notifications.set(sorted);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview.set(base64String);
        this.userData.avatar = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitProfile() {
    const userId = localStorage.getItem('_id');
    if (!userId) return;

    this.isSaving.set(true);

    this.authService.updateUserProfile(userId, this.userData).subscribe({
      next: (response: any) => {
        localStorage.setItem('username', response.username);
        this.isSaving.set(false);
        alert('Profile updated successfully.');
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
        alert('Failed to update profile.');
      }
    });
  }

  onSubmitPassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    const userId = localStorage.getItem('_id');
    if (!userId) return;

    this.isSaving.set(true);

    const payload = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.authService.updateUserPassword(userId, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        alert('Password updated successfully.');
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
        alert(err.error?.message || 'Failed to update password.');
      }
    });
  }
}