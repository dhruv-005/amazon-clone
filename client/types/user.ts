export interface Address {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface UserPreferences {
  language: string;
  currency: string;
  newsletter: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    orderUpdates: boolean;
    deals: boolean;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'customer' | 'seller' | 'admin';
  isVerified: boolean;
  isPrime: boolean;
  primeExpiry?: string;
  addresses: Address[];
  defaultAddress?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
