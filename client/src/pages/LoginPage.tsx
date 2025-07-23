import React, { useState } from 'react'
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import CustomDialog from '../components/CustomDialog';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    
    const navigate = useNavigate();


    const handleLogin = async () => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                throw new Error(`Login failed: ${response.status}`);
            } else {
                console.log("Login successful:", data);
                sessionStorage.setItem('token', data.token);
                setIsOpen(true);
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("Login failed. Please check your credentials.");
        }
    }

    const handleGoogleLogin = () => {
        // setError(null);
        window.location.href = `${API_BASE_URL}/users/oauth/google/login`;
    };


    return (
        <>
        <SearchQueryProvider>
        <Header />
        <div className="w-full h-full absolutetop-[80px]">
        <div className="w-[30%] max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg justify-center items-center">
        <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Login</h2>
            <Input
                type="text"
                
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.currentTarget.value)}
                />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                />
                {error && (
                    <p className="self-start text-red-600 text-sm mb-5">
                        {error}
                    </p>
                )}
            <Button className="w-full" onClick={handleLogin} children="Log In" />
            <Button className="w-full" onClick={handleGoogleLogin} children="Log In with Google" />
            <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">Don't have an account?</p>
                <a href="/register" className="text-base text-blue-500 hover:underline">Signup</a>
            </div>
        </div>
                <CustomDialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    message="You have successfully logged in."
                    buttonTitle="Go to Main Page"
                    onClickButton={() => navigate('/')}
                />
                </div>
                </div>
        </SearchQueryProvider>
        </>
    )
}

export default LoginPage;