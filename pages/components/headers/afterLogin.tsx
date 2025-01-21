import React from 'react';

import SignOutButton from '../SignOutButton';

const AfterLoginHeader: React.FC = () => {
    return (
        <nav className="p-4 border-b border-gray-300 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-black font-bold text-xl">Task Tracker</div>
                <div>
                    <SignOutButton />
                </div>
            </div>
        </nav>
    );
};

export default AfterLoginHeader;