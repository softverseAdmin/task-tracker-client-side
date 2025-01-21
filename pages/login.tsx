"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null;
};

export default Login;