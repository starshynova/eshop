import React, { useState, useEffect } from 'react'
import { Input } from '@headlessui/react';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';
import Button from '../components/Button';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    if (confirmPassword.length > 0) {
      setError(password === confirmPassword ? null : 'Passwords do not match');
    }
  }, [password, confirmPassword]);

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
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-2
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
            <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.currentTarget.value)}
                className={`
                  w-full h-10 text-base border-2 bg-white rounded-md px-2 mb-2
                  ${error ? 'border-red-500' : 'border-[#b7e8ff]'}
                `} />
                {error && (
                    <p className="self-start text-red-600 text-sm mb-2">
                        {error}
                    </p>
                )}
            <Button className="w-full" onClick={() => console.log("Register clicked")} children="Register" />
            <div className="flex flex-row gap-3 mt-7">
                <p className="text-base text-gray-700">Do you have an account?</p>
                <a href="/login" className="text-base text-blue-500 hover:underline">Log In</a>
            </div>
        </div>
        </SearchQueryProvider>
        </>
    )
}

export default RegisterPage;