import React, { useState } from 'react'
import { Input, Dialog, DialogPanel } from '@headlessui/react';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import MainPage from './MainPage';
import { useNavigate } from 'react-router-dom';

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
                // setTimeout(() => {
                //     MainPage;
                // }, 4000);
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("Login failed. Please check your credentials.");
        }
    }

    return (
        <>
        <SearchQueryProvider>
        <Header />

        <div className="flex flex-col w-[40%] max-w-[500px] mx-auto mt-[120px] p-[40px]  bg-[#cacaca] rounded-xl shadow-lg justify-center items-center">
            <Input
                type="text"
                
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.currentTarget.value)}
                className={`
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-5
                  ${error ? 'border-red-500' : 'border-[#b7e8ff]'}
                `} />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                className={`
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-5
                  ${error ? 'border-red-500' : 'border-[#b7e8ff]'}
                `} />
                {error && (
                    <p className="self-start text-red-600 text-sm mb-5">
                        {error}
                    </p>
                )}
            <Button className="w-full" onClick={handleLogin} children="Log In" />
            <div className="flex flex-row gap-3 mt-7">
                <p className="text-base text-gray-700">Don't have an account?</p>
                <a href="/register" className="text-base text-blue-500 hover:underline">Register</a>
            </div>
        </div>
            <Dialog
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  as="div"
                  className="fixed inset-0 z-50 flex items-center justify-center"
                >
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50"
                    aria-hidden="true"
                  />
                  <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="flex flex-col bg-white rounded-lg shadow-lg p-8 max-w-sm w-full justify-center items-center">
                      <p className="text-gray-700 mb-4">
                        You have successfully logged in.
                      </p>
                      <Button
                        onClick={() => {
                          setIsOpen(false)
                          navigate('/')
                        }}
                      >
                        Go to Main Page
                      </Button>
                    </DialogPanel>
                  </div>
                </Dialog>
        </SearchQueryProvider>
        </>
    )
}

export default LoginPage;