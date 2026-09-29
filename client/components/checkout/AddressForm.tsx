'use client';

import React, { useState } from 'react';
import { Address } from '@/types/user';
import { useAddAddressMutation } from '@/store/api/userApi';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddressFormProps {
  onSuccess: (address: Address) => void;
  onCancel?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel }) => {
  const [addAddressApi, { isLoading }] = useAddAddressMutation();
  const [formData, setFormData] = useState<Partial<Address>>({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'home',
    isDefault: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.addressLine1 || !formData.pincode) {
      alert('Please fill all required address fields');
      return;
    }

    try {
      const res = await addAddressApi(formData).unwrap();
      const created = res.data.addresses[res.data.addresses.length - 1];
      onSuccess(created);
    } catch {
      // Local fallback
      onSuccess(formData as Address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      <h3 className="font-bold text-sm text-gray-900 mb-2">Add a new delivery address</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Full name (First and Last name)"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          label="Mobile number (10 digits)"
          required
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
        />
      </div>

      <Input
        label="Flat, House no., Building, Company, Apartment"
        required
        value={formData.addressLine1}
        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
      />

      <Input
        label="Area, Street, Sector, Village"
        value={formData.addressLine2}
        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Town/City"
          required
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        <Input
          label="State"
          required
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
        <Input
          label="PIN Code (6 digits)"
          required
          value={formData.pincode}
          onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Use this address
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
