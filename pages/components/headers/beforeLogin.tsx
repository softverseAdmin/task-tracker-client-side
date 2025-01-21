import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, googleProvider } from '../../../firebase'; 
import { signInWithPopup } from 'firebase/auth';

const BeforeLoginHeader: React.FC = () => {
      const router = useRouter();
      const [, setError] = useState<string | null>(null);
    
      const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider); // Updated to use the modular SDK
          const user = result.user;
          if (user) {
            console.log('Logged in as:', user.displayName);
            router.push('/dashboard'); // Redirect to a dashboard or home page
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      };
    return (
        <>
        <nav className="p-4 border-b border-gray-300 shadow-sm ">
            <div className="container mx-auto flex justify-between items-center">
            <div className="text-black font-bold text-xl">Task management</div>
            <div>
                <button
                onClick={handleGoogleLogin}
                className="text-black hover:text-white-500 px-3 py-2 rounded-md text-sm font-medium border border-black rounder-md"
                >
                Sign In
                </button>
            </div>
            </div>
        </nav>
        </>
    );
};

export default BeforeLoginHeader;