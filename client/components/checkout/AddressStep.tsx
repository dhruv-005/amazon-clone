'use client';

import React, { useState } from 'react';
import { Address } from '@/types/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedAddress, setCheckoutStep } from '@/store/slices/checkoutSlice';
import AddressForm from './AddressForm';
import Button from '../ui/Button';

export const AddressStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const selectedAddress = useAppSelector((state) => state.checkout.selectedAddress);
  const addresses = user?.addresses || [];

  const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);

  const handleSelect = (addr: Address) => {
    dispatch(setSelectedAddress(addr));
  };

  const handleProceed = () => {
    if (selectedAddress) {
      dispatch(setCheckoutStep(2));
    } else {
      alert('Please select or add a delivery address');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
        1. Select a delivery address
      </h2>

      {!isAddingNew && addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((addr, idx) => {
            const isSelected = selectedAddress?._id
              ? selectedAddress._id === addr._id
              : idx === 0;

            return (
              <label
                key={addr._id || idx}
                onClick={() => handleSelect(addr)}
                className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="selected_address"
                  checked={isSelected}
                  onChange={() => handleSelect(addr)}
                  className="mt-1 text-orange-500 focus:ring-orange-400"
                />
                <div className="text-xs sm:text-sm text-gray-800">
                  <p className="font-bold text-gray-900">
                    {addr.fullName}{' '}
                    <span className="text-xs font-normal text-gray-500 capitalize">
                      ({addr.addressType})
                    </span>
                  </p>
                  <p className="mt-0.5">{addr.addressLine1}, {addr.addressLine2 || ''}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-gray-500 mt-1">Phone: {addr.phoneNumber}</p>
                </div>
              </label>
            );
          })}

          <div className="pt-3 flex items-center justify-between">
            <button
              onClick={() => setIsAddingNew(true)}
              className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-bold"
            >
              + Add a new address
            </button>
            <Button variant="primary" onClick={handleProceed}>
              Use this Address
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <AddressForm
            onSuccess={(newAddr) => {
              dispatch(setSelectedAddress(newAddr));
              setIsAddingNew(false);
            }}
            onCancel={addresses.length > 0 ? () => setIsAddingNew(false) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default AddressStep;
