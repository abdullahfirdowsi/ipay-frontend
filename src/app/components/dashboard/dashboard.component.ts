import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Enum for transaction categories
enum TransactionCategory {
  UTILITIES = 'Utilities',
  SHOPPING = 'Shopping',
  INCOME = 'Income',
  ENTERTAINMENT = 'Entertainment',
  RECHARGE = 'Recharge',
  QR_PAYMENT = 'QR Payment',
  WALLET = 'Wallet'
}

// Enum for transaction types
enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

// Interface for transaction data
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Received' | 'Failed';
  category?: string;
  paymentMethod?: string;
  type?: string; // credit or debit
}

// Interface for reward data
interface Reward {
  id: string;
  name: string;
  points: number;
  title: string; // Added for template compatibility
  pointsRequired: number; // Added for template compatibility
  expiryDate: string;
  isRedeemed: boolean;
  description?: string;
}

// Interface for offer data
interface Offer {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  discount: string;
  discountPercentage: string; // Added for template compatibility
  code?: string;
  category?: string;
  isApplied?: boolean;
}

// Quick action identifiers
enum QuickAction {
  SEND_MONEY = 'send_money',
  PAY_BILL = 'pay_bill',
  SCAN_QR = 'scan_qr',
  RECHARGE = 'recharge'
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = null;
  isLoading: boolean = true;
  
  // Financial properties
  walletBalance: number = 0;
  upiId: string = '';
  
  // Data collections
  transactions: Transaction[] = [];
  rewards: Reward[] = [];
  offers: Offer[] = [];
  
  // UI state properties
  activeTab: string = 'transactions';
  paymentInProgress: boolean = false;
  recentPayees: string[] = [];
  
  // Computed properties
  get totalRewardPoints(): number {
    return this.rewards
      .filter(reward => !reward.isRedeemed)
      .reduce((total, reward) => total + reward.points, 0);
  }
  
  get availableRewards(): Reward[] {
    return this.rewards.filter(reward => !reward.isRedeemed);
  }
  
  get specialOffers(): Offer[] {
    return this.offers.filter(offer => !offer.isApplied);
  }
  
  get recentTransactions(): Transaction[] {
    return this.transactions.slice(0, 5);
  }

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
      // This would be replaced with actual API calls to different endpoints
      
      // Set wallet balance and UPI ID
      this.walletBalance = 1250.75;
      this.upiId = 'user@bankupi';
      
      // Sample transactions data
      this.transactions = [
        { id: 't1', date: '2024-04-20', description: 'Electricity Bill', amount: 120.00, status: 'Paid', category: 'Utilities', paymentMethod: 'Wallet' },
        { id: 't2', date: '2024-04-19', description: 'Grocery', amount: 85.50, status: 'Pending', category: 'Shopping', paymentMethod: 'UPI' },
        { id: 't3', date: '2024-04-18', description: 'Salary', amount: 2500.00, status: 'Received', category: 'Income', paymentMethod: 'Bank Transfer' },
        { id: 't4', date: '2024-04-15', description: 'Mobile Recharge', amount: 49.99, status: 'Paid', category: 'Utilities', paymentMethod: 'Wallet' },
        { id: 't5', date: '2024-04-12', description: 'Movie Tickets', amount: 30.00, status: 'Paid', category: 'Entertainment', paymentMethod: 'Credit Card' }
      ];
      
      // Sample rewards data
      this.rewards = [
        { id: 'r1', name: 'Cashback Reward', title: 'Cashback Reward', points: 250, pointsRequired: 250, expiryDate: '2024-06-30', isRedeemed: false, description: '5% cashback on your next bill payment' },
        { id: 'r2', name: 'Welcome Bonus', title: 'Welcome Bonus', points: 500, pointsRequired: 500, expiryDate: '2024-05-15', isRedeemed: false, description: 'Sign-up bonus points' },
        { id: 'r3', name: 'Referral Bonus', title: 'Referral Bonus', points: 350, pointsRequired: 350, expiryDate: '2024-07-20', isRedeemed: false, description: 'Points earned for referring a friend' },
        { id: 'r4', name: 'Transaction Milestone', title: 'Transaction Milestone', points: 150, pointsRequired: 150, expiryDate: '2024-08-10', isRedeemed: false, description: 'Completed 10 transactions' }
      ];
      
      // Sample offers data
      this.offers = [
        { id: 'o1', title: 'Electricity Bill', description: '10% cashback on electricity bill payments', validUntil: '2024-05-30', discount: '10%', discountPercentage: '10%', code: 'POWER10' },
        { id: 'o2', title: 'Mobile Recharge', description: 'Flat ₹50 off on recharges above ₹300', validUntil: '2024-05-15', discount: '₹50', discountPercentage: 'Flat ₹50', code: 'RECHARGE50' },
        { id: 'o3', title: 'DTH Recharge', description: '5% cashback on all DTH recharges', validUntil: '2024-06-10', discount: '5%', discountPercentage: '5%', code: 'DTH5' }
      ];
      
      // Set recent payees
      this.recentPayees = ['John Doe', 'ABC Utilities', 'XYZ Mobile'];
      
      this.isLoading = false;
    }, 1000);
  }
  
  /**
   * Sign out user
   */
  signOut(): void {
    this.authService.logout();
  }
  
  /**
   * Make a payment for bills, services, etc.
   * @param {string} paymentType - Type of payment (bill, service, etc.)
   * @param {string} recipient - Recipient identifier
   * @param {number} amount - Payment amount
   * @returns {Promise<boolean>} Payment success status
   */
  async makePayment(paymentType: string, recipient: string, amount: number): Promise<boolean> {
    this.paymentInProgress = true;
    
    try {
      // In a real app, this would be an API call
      console.log(`Processing ${paymentType} payment of ${amount} to ${recipient}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update wallet balance
      this.walletBalance -= amount;
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `${paymentType} - ${recipient}`,
        amount: amount,
        status: 'Paid',
        category: paymentType,
        type: TransactionType.DEBIT,
        paymentMethod: 'Wallet'
      };
      
      this.transactions.unshift(newTransaction);
      this.paymentInProgress = false;
      
      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      this.paymentInProgress = false;
      return false;
    }
  }

  /**
   * Shows a dialog to collect payment information
   * Then calls makePayment with the entered details
   */
  showPaymentDialog(): void {
    const recipient = prompt('Enter recipient name or UPI ID:');
    if (!recipient) return;

    const amount = prompt('Enter amount to send:');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const paymentType = 'Send Money';

    this.makePayment(paymentType, recipient, Number(amount))
      .then(success => {
        if (success) {
          alert('Payment successful!');
        } else {
          alert('Payment failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error during payment:', err);
        alert('An error occurred during payment.');
      });
  }
  
  /**
   * Scan QR code and process payment
   * @param {string} qrData - Simulated QR code data
   * @returns {Promise<boolean>} Scan and pay success status
   */
  async scanAndPay(qrData?: string): Promise<boolean> {
    // In a real app, this would activate the camera or handle scanned QR data
    // For simulation, we'll create a mock QR payment
    
    const mockQrData = qrData || 'upi://pay?pa=merchant@upi&pn=Store&am=45.50';
    console.log('Processing QR payment:', mockQrData);
    
    try {
      // Parse QR data (simple mock implementation)
      const amount = parseFloat(mockQrData.split('am=')[1] || '10');
      const recipient = mockQrData.split('pn=')[1]?.split('&')[0] || 'Unknown Merchant';
      
      // Process the payment
      return await this.makePayment('QR Payment', recipient, amount);
    } catch (error) {
      console.error('QR scan payment failed:', error);
      return false;
    }
  }

  /**
   * Simulates scanning a QR code and processes the payment
   * In a real app, this would open the camera or QR scanner
   */
  simulateScanAndPay(): void {
    // Simulate a QR code scan with a modal or prompt
    alert('Scanning QR code... (simulation)');
    
    // Generate random QR data for the demo
    const amount = Math.floor(Math.random() * 100) + 10;
    const merchants = ['Coffee Shop', 'Grocery Store', 'Restaurant', 'Book Store'];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    
    const qrData = `upi://pay?pa=merchant@upi&pn=${merchant}&am=${amount}`;
    
    this.scanAndPay(qrData)
      .then(success => {
        if (success) {
          alert(`Payment of ₹${amount} to ${merchant} successful!`);
        } else {
          alert('QR code payment failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error during QR payment:', err);
        alert('An error occurred during QR payment.');
      });
  }
  
  /**
   * Process mobile or service recharge
   * @param {string} provider - Service provider
   * @param {string} number - Mobile or service number
   * @param {number} amount - Recharge amount
   * @param {string} [plan] - Optional plan details
   * @returns {Promise<boolean>} Recharge success status
   */
  async recharge(provider: string, number: string, amount: number, plan?: string): Promise<boolean> {
    try {
      console.log(`Processing ${provider} recharge for ${number}, amount: ${amount}, plan: ${plan || 'N/A'}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Update wallet balance
      this.walletBalance -= amount;
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `${provider} Recharge - ${number}`,
        amount: amount,
        status: 'Paid',
        category: 'Recharge',
        type: 'Recharge', // Added for template compatibility
        paymentMethod: 'Wallet'
      };
      
      this.transactions.unshift(newTransaction);
      return true;
    } catch (error) {
      console.error('Recharge failed:', error);
      return false;
    }
  }
  
  /**
   * Redeem a reward
   * @param {string} rewardId - ID of the reward to redeem
   * @returns {Promise<boolean>} Redemption success status
   */
  async redeemReward(rewardId: string | Reward): Promise<boolean> {
    // If a Reward object was passed, extract the ID
    const id = typeof rewardId === 'string' ? rewardId : rewardId.id;
    try {
      // Find the reward by ID
      const rewardIndex = this.rewards.findIndex(r => r.id === id);
      
      if (rewardIndex === -1) {
        throw new Error('Reward not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mark the reward as redeemed
      this.rewards[rewardIndex] = {
        ...this.rewards[rewardIndex],
        isRedeemed: true
      };
      
      console.log(`Reward ${this.rewards[rewardIndex].name} redeemed successfully`);
      return true;
    } catch (error) {
      console.error('Reward redemption failed:', error);
      return false;
    }
  }

  /**
   * Shows a dialog to select rewards to redeem
   * Used for the "Redeem Rewards" button in the UI
   */
  redeemRewards(): void {
    if (this.availableRewards.length === 0) {
      alert('You have no available rewards to redeem.');
      return;
    }

    // In a real app, this would be a proper dialog or modal
    // For this simple implementation, we'll use browser prompt
    const rewardOptions = this.availableRewards.map(
      (r, i) => `${i + 1}. ${r.title} (${r.pointsRequired} points)`
    ).join('\n');

    const selection = prompt(
      `Select a reward to redeem by entering its number:\n${rewardOptions}`
    );

    if (!selection || isNaN(Number(selection))) return;

    const index = Number(selection) - 1;
    if (index < 0 || index >= this.availableRewards.length) {
      alert('Invalid selection');
      return;
    }

    const selectedReward = this.availableRewards[index];
    
    // Check if user has enough points
    if (this.totalRewardPoints < selectedReward.pointsRequired) {
      alert(`You don't have enough points to redeem this reward. You need ${selectedReward.pointsRequired} points.`);
      return;
    }

    this.redeemReward(selectedReward)
      .then(success => {
        if (success) {
          alert(`Successfully redeemed: ${selectedReward.title}`);
        } else {
          alert('Failed to redeem reward. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error redeeming reward:', err);
        alert('An error occurred while redeeming the reward.');
      });
  }
  
  /**
   * Get filtered transactions by category
   * @param {string} category - Category to filter by
   * @returns {Transaction[]} Filtered transactions
   */
  getTransactionsByCategory(category: string): Transaction[] {
    return this.transactions.filter(t => t.category === category);
  }
  
  /**
   * Get transaction summary statistics
   * @returns {Object} Summary statistics
   */
  getTransactionSummary() {
    const totalSpent = this.transactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalReceived = this.transactions
      .filter(t => t.status === 'Received')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      totalSpent,
      totalReceived,
      netBalance: totalReceived - totalSpent
    };
  }
  
  /**
   * Add money to wallet
   * @param {number} amount - Amount to add
   * @returns {Promise<boolean>} Success status
   */
  async addMoney(amount: number): Promise<boolean> {
    try {
      console.log(`Adding ${amount} to wallet`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update wallet balance
      this.walletBalance += amount;
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: 'Add Money to Wallet',
        amount: amount,
        status: 'Received',
        category: TransactionCategory.WALLET,
        type: TransactionType.CREDIT,
        paymentMethod: 'Bank Transfer'
      };
      
      this.transactions.unshift(newTransaction);
      return true;
    } catch (error) {
      console.error('Add money failed:', error);
      return false;
    }
  }

  /**
   * Shows a dialog to prompt user for amount to add to wallet
   * Then calls addMoney with the entered amount
   */
  showAddMoneyDialog(): void {
    const amount = prompt('Enter amount to add to your wallet:');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      this.addMoney(Number(amount))
        .then(success => {
          if (success) {
            alert('Money added successfully!');
          } else {
            alert('Failed to add money. Please try again.');
          }
        })
        .catch(err => {
          console.error('Error adding money:', err);
          alert('An error occurred while adding money.');
        });
    } else if (amount !== null) {
      alert('Please enter a valid amount');
    }
  }
  
  /**
   * Recharge phone with specified amount and number
   * @param {string} phoneNumber - Phone number to recharge
   * @param {number} amount - Recharge amount
   * @param {string} operator - Mobile operator
   * @returns {Promise<boolean>} Success status
   */
  async rechargePhone(phoneNumber: string, amount: number, operator: string = 'Default'): Promise<boolean> {
    return this.recharge(operator, phoneNumber, amount);
  }

  /**
   * Shows a dialog to collect information for phone recharge
   * Then calls rechargePhone with the entered details
   */
  showRechargeDialog(): void {
    const phoneNumber = prompt('Enter phone number:');
    if (!phoneNumber) return;

    const amount = prompt('Enter recharge amount:');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const operator = prompt('Enter operator (optional):') || 'Default';

    this.rechargePhone(phoneNumber, Number(amount), operator)
      .then(success => {
        if (success) {
          alert('Recharge successful!');
        } else {
          alert('Recharge failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error during recharge:', err);
        alert('An error occurred during recharge.');
      });
  }
  
  /**
   * Pay a bill
   * @param {string} billType - Type of bill (electricity, water, etc.)
   * @param {string} billerId - Biller ID or account number
   * @param {number} amount - Bill amount
   * @returns {Promise<boolean>} Success status
   */
  async payBill(billType: string, billerId: string, amount: number): Promise<boolean> {
    return this.makePayment(billType, billerId, amount);
  }

  /**
   * Shows a dialog to collect bill payment information
   * Then calls payBill with the entered details
   * @param {string} [billType] - Optional bill type, if known in advance
   */
  showBillPaymentDialog(billType?: string): void {
    const type = billType || prompt('Enter bill type (electricity, water, gas, etc.):');
    if (!type) return;

    const billerId = prompt('Enter consumer ID or account number:');
    if (!billerId) return;

    const amount = prompt('Enter bill amount:');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    this.payBill(type, billerId, Number(amount))
      .then(success => {
        if (success) {
          alert('Bill payment successful!');
        } else {
          alert('Bill payment failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error during bill payment:', err);
        alert('An error occurred during bill payment.');
      });
  }
  
  /**
   * Apply an offer
   * @param {string} offerId - ID of the offer to apply
   * @returns {Promise<boolean>} Success status
   */
  async applyOffer(offerId: string | Offer): Promise<boolean> {
    // If an Offer object was passed, extract the ID
    const id = typeof offerId === 'string' ? offerId : offerId.id;
    try {
      // Find the offer by ID
      const offerIndex = this.offers.findIndex(o => o.id === id);
      
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mark the offer as applied
      this.offers[offerIndex] = {
        ...this.offers[offerIndex],
        isApplied: true
      };
      
      console.log(`Offer ${this.offers[offerIndex].title} applied successfully`);
      return true;
    } catch (error) {
      console.error('Offer application failed:', error);
      return false;
    }
  }
  
  /**
   * Get CSS class for transaction icon based on category
   * @param {Transaction} transaction - The transaction
   * @returns {string} CSS class for the icon
   */
  getTransactionIconClass(category: string | undefined): string {
    const categoryMapping: {[key: string]: string} = {
      'Utilities': 'text-primary',
      'Shopping': 'text-info',
      'Income': 'text-success',
      'Entertainment': 'text-warning',
      'Recharge': 'text-secondary',
      'QR Payment': 'text-dark',
      'Wallet': 'text-primary',
      'Default': 'text-muted'
    };
    
    return categoryMapping[category || 'Default'] || 'text-muted';
  }
  
  /**
   * Get icon for transaction based on category
   * @param {Transaction} transaction - The transaction
   * @returns {string} Icon class
   */
  getTransactionIcon(category: string | undefined): string {
    const categoryMapping: {[key: string]: string} = {
      'Utilities': 'bi bi-lightning',
      'Shopping': 'bi bi-cart',
      'Income': 'bi bi-wallet',
      'Entertainment': 'bi bi-film',
      'Recharge': 'bi bi-phone',
      'QR Payment': 'bi bi-qr-code',
      'Wallet': 'bi bi-cash',
      'Default': 'bi bi-arrow-right-circle'
    };
    
    return categoryMapping[category || 'Default'] || 'bi bi-arrow-right-circle';
  }
  
  /**
   * Get CSS class for status badge
   * @param {string} status - Transaction status
   * @returns {string} CSS class for status badge
   */
  getStatusBadgeClass(status: string): string {
    const statusMapping: {[key: string]: string} = {
      'Paid': 'bg-success',
      'Pending': 'bg-warning',
      'Received': 'bg-primary',
      'Failed': 'bg-danger'
    };
    
    return statusMapping[status] || 'bg-secondary';
  }
}
