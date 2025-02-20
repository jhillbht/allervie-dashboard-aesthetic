import React from 'react';
import AccountSelectionWizard from '../../components/auth/AccountSelectionWizard';

export default function AccountSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AccountSelectionWizard />
      </div>
    </div>
  );
}