'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const LocationSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm text-left leading-tight transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4 text-white fill-current mt-2" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-300 font-normal">
            Deliver to {user ? user.name.split(' ')[0] : 'India'}
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[110px]">
            {defaultAddr ? `${defaultAddr.city} ${defaultAddr.pincode}` : 'Select location'}
          </span>
        </div>
      </button>

      {/* Location Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Choose your location">
        <div className="text-xs text-gray-600 space-y-4">
          <p>
            Delivery options and delivery speeds may vary for different locations.
          </p>

          {user && user.addresses?.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-gray-800">Saved addresses:</span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setIsOpen(false)}
                    className="p-2 border border-gray-200 hover:border-orange-500 rounded cursor-pointer transition bg-gray-50"
                  >
                    <strong>{addr.fullName}</strong> — {addr.city}, {addr.pincode}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <span className="font-bold text-gray-800 block mb-2">Or enter an Indian PIN code</span>
            <form onSubmit={handleApplyPincode} className="flex gap-2">
              <Input
                placeholder="Enter 6-digit PIN code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <Button type="submit" variant="primary" size="sm">
                Apply
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LocationSelector;
