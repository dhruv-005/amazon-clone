'use client';

import React from 'react';
import { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  onToggleBan?: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onToggleBan }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold">
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Prime Status</th>
            <th className="p-3">Joined Date</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="p-3 font-bold text-gray-900">{u.name}</td>
              <td className="p-3 text-gray-600">{u.email}</td>
              <td className="p-3">
                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 border">
                  {u.role}
                </span>
              </td>
              <td className="p-3">
                {u.isPrime ? (
                  <span className="text-[#00a8e1] font-bold">prime</span>
                ) : (
                  <span className="text-gray-400">Regular</span>
                )}
              </td>
              <td className="p-3 text-gray-500">
                {new Date(u.createdAt).toLocaleDateString('en-IN')}
              </td>
              <td className="p-3 text-right">
                {onToggleBan && (
                  <button
                    onClick={() => onToggleBan(u._id)}
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Suspend
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
