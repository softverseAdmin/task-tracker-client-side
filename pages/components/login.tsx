import { useState } from 'react';
import { auth, googleProvider } from '../../firebase'; // Modular imports
import { useRouter } from 'next/router';
import { signInWithPopup } from 'firebase/auth'; // Import the method from 'firebase/auth'
import BeforeLoginHeader from './headers/beforeLogin';

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Updated to use the modular SDK
      const user = result.user;
      if (user) {
        console.log('Logged in as:', user.displayName);
        router.push('/dashboard');
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
      <BeforeLoginHeader />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
