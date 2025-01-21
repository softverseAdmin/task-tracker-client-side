// components/SignOutButton.tsx
import { auth } from '../../firebase';
import React from 'react';

const SignOutButton: React.FC = () => {
    const handleSignOut = async () => {
        await auth.signOut();
    };

    return <button className="text-black hover:text-white-500 px-3 py-2 rounded-md text-sm font-medium border border-black rounder-md" onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
