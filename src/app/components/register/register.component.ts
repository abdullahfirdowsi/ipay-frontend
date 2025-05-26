import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    upiId: '',
    password: ''
  };
  
  confirmPassword = '';
  errorMessage = '';
  isSubmitting = false;
  
  // Password validation flags
  passwordValidation = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false
  };
  
  // Password strength indicators
  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthClass = '';
  
  constructor(private api: ApiService, private router: Router) {}
  
  // Validate password in real-time
  validatePassword(): void {
    const password = this.user.password;
    
    // Reset all validation flags
    this.passwordValidation.minLength = password.length >= 8;
    this.passwordValidation.hasUpperCase = /[A-Z]/.test(password);
    this.passwordValidation.hasLowerCase = /[a-z]/.test(password);
    this.passwordValidation.hasNumber = /[0-9]/.test(password);
    this.passwordValidation.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    this.passwordValidation.passwordsMatch = password === this.confirmPassword && password !== '';
    
    // Calculate password strength
    this.calculatePasswordStrength();
  }
  
  // Calculate password strength based on criteria met
  calculatePasswordStrength(): void {
    const validationValues = Object.values(this.passwordValidation);
    const trueCount = validationValues.filter(value => value === true).length;
    
    // Calculate strength as percentage (excluding passwordsMatch)
    this.passwordStrength = Math.floor((trueCount - (this.passwordValidation.passwordsMatch ? 1 : 0)) / 5 * 100);
    
    // Set strength text and class
    if (this.passwordStrength <= 20) {
      this.passwordStrengthText = 'Very Weak';
      this.passwordStrengthClass = 'bg-danger';
    } else if (this.passwordStrength <= 40) {
      this.passwordStrengthText = 'Weak';
      this.passwordStrengthClass = 'bg-warning';
    } else if (this.passwordStrength <= 60) {
      this.passwordStrengthText = 'Medium';
      this.passwordStrengthClass = 'bg-info';
    } else if (this.passwordStrength <= 80) {
      this.passwordStrengthText = 'Strong';
      this.passwordStrengthClass = 'bg-primary';
    } else {
      this.passwordStrengthText = 'Very Strong';
      this.passwordStrengthClass = 'bg-success';
    }
  }
  
  // Validate the entire form before submission
  validateForm(): boolean {
    this.errorMessage = '';
    
    // Check if all fields are filled
    if (!this.user.name || !this.user.email || !this.user.upiId || !this.user.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return false;
    }
    
    // Check email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    
    // Check UPI ID format (basic validation)
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiPattern.test(this.user.upiId)) {
      this.errorMessage = 'Please enter a valid UPI ID (e.g., yourname@bank)';
      return false;
    }
    
    // Check password validation
    if (!this.passwordValidation.minLength) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }
    
    if (!this.passwordValidation.hasUpperCase) {
      this.errorMessage = 'Password must contain at least one uppercase letter';
      return false;
    }
    
    if (!this.passwordValidation.hasLowerCase) {
      this.errorMessage = 'Password must contain at least one lowercase letter';
      return false;
    }
    
    if (!this.passwordValidation.hasNumber) {
      this.errorMessage = 'Password must contain at least one number';
      return false;
    }
    
    if (!this.passwordValidation.hasSpecialChar) {
      this.errorMessage = 'Password must contain at least one special character';
      return false;
    }
    
    if (!this.passwordValidation.passwordsMatch) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    
    return true;
  }
  
  register() {
    // First validate the form
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.api.registerUser(this.user).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);
        
        if (error.status === 400) {
          this.errorMessage = 'Email or UPI ID already registered. Please use different credentials.';
        } else {
          this.errorMessage = 'Error during registration. Please try again later.';
        }
      }
    });
  }
}
