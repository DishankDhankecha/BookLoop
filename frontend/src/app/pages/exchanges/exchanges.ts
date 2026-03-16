import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../components/dashboard/navbar/navbar";
import { Sidebar } from "../../components/dashboard/sidebar/sidebar";
import { CommonModule } from '@angular/common';
import { Exchange } from '../../services/exchange';

@Component({
  selector: 'app-exchanges',
  imports: [Navbar, Sidebar, CommonModule],
  templateUrl: './exchanges.html',
  styleUrl: './exchanges.css',
})
export class Exchanges implements OnInit {
  private exchangeService = inject(Exchange);

  incomingRequests = signal<any[]>([]);
  outgoingRequests = signal<any[]>([]);

  currentView = signal<'active' | 'history'>('active');

  activeIncoming = computed(() => this.incomingRequests().filter(req => req.status === 'Pending' || req.status === 'Accepted'));
  historyIncoming = computed(() => this.incomingRequests().filter(req => req.status === 'Completed' || req.status === 'Declined'));

  activeOutgoing = computed(() => this.outgoingRequests().filter(req => req.status === 'Pending' || req.status === 'Accepted'));
  historyOutgoing = computed(() => this.outgoingRequests().filter(req => req.status === 'Completed' || req.status === 'Declined'));

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.exchangeService.getIncomingRequests().subscribe({
      next: (data) => this.incomingRequests.set(data),
      error: (err) => console.error(err)
    });

    this.exchangeService.getOutgoingRequests().subscribe({
      next: (data) => this.outgoingRequests.set(data),
      error: (err) => console.error(err)
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
