import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check authentication status on service initialization
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  /**
   * Check if the user has a valid auth token in localStorage
   */
  public isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Check if there's an auth token in localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get the current user's email from localStorage
   */
  public getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  /**
   * Handle successful login
   * @param token The authentication token
   * @param email The user's email
   */
  public login(token: string, email: string): void {
    // Store authentication data in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);

    // Update the authentication state
    this.isAuthenticatedSubject.next(true);

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Handle user logout
   */
  public logout(): void {
    // Clear authentication data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');

    // Update the authentication state
    this.isAuthenticatedSubject.next(false);

    // Navigate to login page
    this.router.navigate(['/login']);
  }
}

