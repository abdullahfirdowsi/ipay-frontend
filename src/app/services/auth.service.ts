import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private tokenExpirationTimeout: any;

  constructor(private router: Router) {
    this.checkTokenExpiration();
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Check if there's a valid auth token in localStorage
   */
  private hasToken(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    // Check token expiration
    const expirationTime = localStorage.getItem('token_expiration');
    if (!expirationTime) return false;

    return Date.now() < parseInt(expirationTime);
  }

  /**
   * Get the current user's email
   */
  public getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  /**
   * Get the current user's token
   */
  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Handle successful login
   * @param token The authentication token
   * @param email The user's email
   * @param expiration The token expiration time in milliseconds
   */
  public login(token: string, email: string, expiration: number): void {
    // Store authentication data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);
    localStorage.setItem('token_expiration', (Date.now() + expiration).toString());

    // Clear any existing timeout
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }

    // Set new expiration timeout
    this.tokenExpirationTimeout = setTimeout(() => {
      this.handleTokenExpiration();
    }, expiration);

    // Update authentication state
    this.isAuthenticatedSubject.next(true);

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Handle token expiration
   */
  private handleTokenExpiration(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('token_expiration');
  }

  /**
   * Check token expiration periodically
   */
  private checkTokenExpiration(): void {
    setInterval(() => {
      if (!this.hasToken()) {
        this.clearAuthData();
        this.isAuthenticatedSubject.next(false);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Log out the user
   */
  public logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}

