import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, ArrowUpRight, ArrowDownLeft, Plus, Nfc, History } from 'lucide-angular';

interface Transaction {
  id: number;
  type: 'CREDIT' | 'DEBIT';
  title: string;
  date: string;
  amount: number;
  status?: string;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './wallet.html'
})
export class WalletComponent {
  // Icons
  readonly Wallet = Wallet;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownLeft = ArrowDownLeft;
  readonly Plus = Plus;
  readonly Nfc = Nfc;
  readonly History = History;

  balance = 1250.50;

  transactions: Transaction[] = [
    { 
      id: 1, 
      type: 'CREDIT', 
      title: 'Delivery Earnings', 
      date: 'Today, 10:23 AM', 
      amount: 45.00,
      status: 'Completed'
    },
    { 
      id: 2, 
      type: 'DEBIT', 
      title: 'Commission Fee', 
      date: 'Yesterday, 4:50 PM', 
      amount: 12.50,
      status: 'Auto-Paid'
    },
    { 
      id: 3, 
      type: 'CREDIT', 
      title: 'Top Up (Credit Card)', 
      date: 'Jan 28, 2026', 
      amount: 500.00,
      status: 'Success'
    },
    { 
      id: 4, 
      type: 'DEBIT', 
      title: 'Withdrawal to Bank', 
      date: 'Jan 25, 2026', 
      amount: 1000.00,
      status: 'Processing'
    }
  ];
}