import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:5178/api'; // Replace with your backend URL

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${BASE_URL}/users/register`, user);
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${BASE_URL}/users/login`, credentials);
  }

  makePayment(paymentData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/transactions/pay`, paymentData);
  }

  // Add other methods as needed...
}