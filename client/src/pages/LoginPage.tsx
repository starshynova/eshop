import React, { useState } from 'react'
import { Input } from '@headlessui/react';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';
import Button from '../components/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null)

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
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-1
                  ${error ? 'border-red-500' : 'border-[#b7e8ff]'}
                `} />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                className={`
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-2
                  ${error ? 'border-red-500' : 'border-[#b7e8ff]'}
                `} />
                {error && (
                    <p className="self-start text-red-600 text-sm mb-2">
                        {error}
                    </p>
                )}
            <Button className="w-full" onClick={() => console.log("Login clicked")} children="Log In" />
            <div className="flex flex-row gap-3 mt-7">
                <p className="text-base text-gray-700">Don't have an account?</p>
                <a href="/register" className="text-base text-blue-500 hover:underline">Register</a>
            </div>
        </div>
        </SearchQueryProvider>
        </>
    )
}

export default LoginPage;