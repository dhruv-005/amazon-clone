export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}
