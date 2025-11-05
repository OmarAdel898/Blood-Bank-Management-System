import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-blood-bank-list',
  imports: [CommonModule],
  templateUrl: './blood-bank-list.html',
  styleUrl: './blood-bank-list.css'
})
export class BloodBankList {
  activeTab: string = 'donors';

  bloodDonors = [
  { name: 'ABC', contact: 'XXXXXXXXXX' },
  { name: 'DEF', contact: 'XXXXXXXXXX' },
  { name: 'GHI', contact: 'XXXXXXXXXX' },
  { name: 'LMN', contact: 'XXXXXXXXXX' },
  { name: 'XYZ', contact: 'XXXXXXXXXX' }
  ];

  bloodBanks = [
    {
      name: 'NAME OF THE BLOOD BANK',
      address: 'ABC Hospital Building, XYZ Road, Place, District, Pincode',
      contact: '0000000000'
    },
    {
      name: 'NAME OF THE BLOOD BANK',
      address: 'ABC Hospital Building, XYZ Road, Place, District, Pincode',
      contact: '0000000000'
    },
    {
      name: 'NAME OF THE BLOOD BANK',
      address: 'ABC Hospital Building, XYZ Road, Place, District, Pincode',
      contact: '0000000000'
    },
    {
      name: 'NAME OF THE BLOOD BANK',
      address: 'ABC Hospital Building, XYZ Road, Place, District, Pincode',
      contact: '0000000000'
    }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  } 
}
