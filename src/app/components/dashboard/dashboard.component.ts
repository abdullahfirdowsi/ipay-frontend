import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = null;
  isLoading: boolean = true;
  transactions: any[] = []; // This would typically be a properly typed array

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get user email from AuthService
    this.userEmail = this.authService.getUserEmail();
    
    // Check authentication state
    if (!this.authService.isAuthenticated()) {
      // User is not authenticated, AuthGuard should handle redirection
      // This is a safety check in case someone bypasses the guard
      this.authService.logout();
      return;
    }
    
    // Fetch user data, transactions, etc., from API if needed
    this.loadDashboardData();
  }

  /**
   * Load dashboard data from API
   * This is a placeholder for actual API integration
   */
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // This would be replaced with actual API call
      this.transactions = [
        { date: '2024-04-20', description: 'Electricity Bill', amount: 120.00, status: 'Paid' },
        { date: '2024-04-19', description: 'Grocery', amount: 85.50, status: 'Pending' },
        { date: '2024-04-18', description: 'Salary', amount: 2500.00, status: 'Received' }
      ];
      
      this.isLoading = false;
    }, 1000);
  }
  
  /**
   * Sign out user
   */
  signOut(): void {
    this.authService.logout();
  }
}
