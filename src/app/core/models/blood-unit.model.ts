import { BloodType } from "./blood-request.model";

export interface BloodUnit {
  id: string;
  bloodType: BloodType;
  collectedDate: string;
  expiryDate: string;
  status: 'available' | 'reserved' | 'expired' | 'used';
  donorId?: string;
  location?: string;
}
