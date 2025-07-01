
import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Header from '../components/Header';
import { SearchQueryProvider } from '../context/SearchQueryContext';

interface Step1Data {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step2Data {
  firstName: string;
  lastName: string;
  address: string;
  postcode: string;
  city: string;
}

enum Step {
  Credentials = 1,
  Profile,
}

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Credentials);
  const [step1, setStep1] = useState<Step1Data>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [step2, setStep2] = useState<Step2Data>({
    firstName: '',
    lastName: '',
    address: '',
    postcode: '',
    city: '',
  });
  const [error, setError] = useState<string | null>(null);

  const validateStep1 = () => {
    const { email, password, confirmPassword } = step1;
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(Step.Profile);
  };

  const handleRegister = () => {
    // final submission
    console.log('Registering user with data:', {
      ...step1,
      ...step2,
    });
  };

  return (
    <>
    <SearchQueryProvider>
    <Header />
    
    <div className="w-[30%] max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg justify-center items-center">
      {step === Step.Credentials && (
        <div className="space-y-4">
        <h2 className="text-3xl font-semibold">Signup</h2>
          <h3 className="text-xl font-semibold">Step 1 of 2</h3>
          <Input
            type="email"
            placeholder="E-mail"
            value={step1.email}
            onChange={e => setStep1({ ...step1, email: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="password"
            placeholder="Password"
            value={step1.password}
            onChange={e => setStep1({ ...step1, password: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={step1.confirmPassword}
            onChange={e => setStep1({ ...step1, confirmPassword: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex w-full justify-end">
          <Button className="justify-end w-[45%]" onClick={handleNext}>
            Next
          </Button>
          
          </div>
          <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">Do you have an account?</p>
                <a href="/login" className="text-base text-blue-500 hover:underline">Login</a>
            </div>
        </div>
      )}

      {step === Step.Profile && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Step 2 of 2</h2>
          <Input
            type="text"
            placeholder="First Name"
            value={step2.firstName}
            onChange={e => setStep2({ ...step2, firstName: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={step2.lastName}
            onChange={e => setStep2({ ...step2, lastName: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="text"
            placeholder="Address"
            value={step2.address}
            onChange={e => setStep2({ ...step2, address: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="text"
            placeholder="Postcode"
            value={step2.postcode}
            onChange={e => setStep2({ ...step2, postcode: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <Input
            type="text"
            placeholder="City"
            value={step2.city}
            onChange={e => setStep2({ ...step2, city: e.currentTarget.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-between">
            <Button className="w-[45%]" onClick={() => setStep(Step.Credentials)}>Back</Button>
            <Button className="w-[45%]" onClick={handleRegister}>
              Register
            </Button>
          </div>
          <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">Do you have an account?</p>
                <a href="/login" className="text-base text-blue-500 hover:underline">Login</a>
            </div>
        </div>
      )}
    </div>
    </SearchQueryProvider>
    </>
  );
};

export default RegisterPage;
