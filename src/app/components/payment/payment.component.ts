import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  payment = {
    recipient: '',
    amount: null,
    note: ''
  };

  constructor(private api: ApiService) {}

  pay() {
    if (this.payment.amount <= 0) {
      alert('Enter a valid amount');
      return;
    }
    this.api.makePayment(this.payment).subscribe(response => {
      alert('Payment successful!');
      // Optionally, navigate to dashboard or clear form
    }, error => {
      alert('Payment failed. Try again.');
    });
  }
}