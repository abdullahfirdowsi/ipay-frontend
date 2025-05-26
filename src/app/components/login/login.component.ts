import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  isSubmitting = false;
  errorMessage = '';
  
  constructor(private api: ApiService, private authService: AuthService) {}
  
  // Validate email format
  isValidEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(this.credentials.email);
  }
  
  // Validate password - basic check for login form
  isValidPassword(): boolean {
    // For login, we just ensure minimum length as a basic check
    // More comprehensive validation happens on the registration form
    return this.credentials.password.length >= 6;
  }
  
  // Validate form before submission
  validateForm(): boolean {
    this.errorMessage = '';
    
    // Check if both fields are empty
    if (!this.credentials.email && !this.credentials.password) {
      this.errorMessage = 'Email and password are required';
      return false;
    }
    
    // Check email
    if (!this.credentials.email) {
      this.errorMessage = 'Email is required';
      return false;
    }
    
    if (!this.isValidEmail()) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    
    // Check password
    if (!this.credentials.password) {
      this.errorMessage = 'Password is required';
      return false;
    }
    
    if (!this.isValidPassword()) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    
    return true;
  }
  
  login() {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.api.loginUser(this.credentials).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Use AuthService to handle login and navigation
        this.authService.login(response.token || 'dummy-token', this.credentials.email);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 404) {
          this.errorMessage = 'Account not found. Please register first.';
        } else {
          this.errorMessage = 'Server error. Please try again later.';
        }
      }
    });
  }
}
