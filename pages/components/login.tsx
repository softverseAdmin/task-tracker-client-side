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
        <div className="bg-white p-8 rounded-lg shadow-lg w-full h-screen text-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-center">ログイン</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button 
            onClick={handleGoogleLogin} 
            className="flex w-full max-w-[480px] min-w-[84px] h-10 ml-auto mr-auto items-center justify-center overflow-hidden rounded-xl bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] px-4 cursor-pointer"
          >
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
