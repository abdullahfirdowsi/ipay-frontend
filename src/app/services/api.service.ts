import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, AuthResponse, Payment, PaymentResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  registerUser(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, user)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  loginUser(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  makePayment(paymentData: Payment): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/transactions/pay`, paymentData)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Add other methods as needed...
  getUserProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/users/profile`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getPaymentHistory(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/transactions/history`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}