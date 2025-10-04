import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/CustomDialog";
import { useAuth } from "../context/AuthContext";

interface Step1Data {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step2Data {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  postcode: string;
  city: string;
}

const Step = {
  Credentials: 1,
  Profile: 2,
} as const;
type Step = (typeof Step)[keyof typeof Step];

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Credentials);
  const [step1, setStep1] = useState<Step1Data>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step2, setStep2] = useState<Step2Data>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    postcode: "",
    city: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
const { login } = useAuth();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const { email, password, confirmPassword } = step1;
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(Step.Profile);
  };

  const handleRegister = async () => {
    const { confirmPassword, ...credentials } = step1;

    if (
      !step2.firstName ||
      !step2.lastName ||
      !step2.address1 ||
      !step2.postcode ||
      !step2.city
    ) {
      setError("All fields in step 2 are required.");
      return;
    }

    const userData = {
      role: "user",
      email: credentials.email,
      password: credentials.password,
      first_name: step2.firstName,
      last_name: step2.lastName,
      address_line1: step2.address1,
      address_line2: step2.address2 || null,
      post_code: step2.postcode,
      city: step2.city,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        throw new Error(`Registration failed: ${response.status}`);
      }
      const data = await response.json();
      // localStorage.setItem("token", data.token);
      await login(data.token);
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <>
      <SearchQueryProvider>
        <Header />

        <div className="w-[30%] max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg justify-center items-center">
          {step === Step.Credentials && (
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold">Signup</h2>
              <h3 className="text-xl font-semibold">Step 1 of 2</h3>
              <Input
                type="email"
                label="E-mail"
                value={step1.email}
                onChange={(e) =>
                  setStep1({ ...step1, email: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="password"
                label="Password"
                value={step1.password}
                onChange={(e) =>
                  setStep1({ ...step1, password: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="password"
                label="Confirm Password"
                value={step1.confirmPassword}
                onChange={(e) =>
                  setStep1({ ...step1, confirmPassword: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex w-full justify-end">
                <Button
                  className="justify-end w-[45%]"
                  onClick={handleNext}
                  children="Next"
                />
              </div>
              <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">
                  Do you have an account?
                </p>
                <a
                  href="/login"
                  className="text-base text-blue-500 hover:underline"
                >
                  Login
                </a>
              </div>
            </div>
          )}

          {step === Step.Profile && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Step 2 of 2</h2>
              <Input
                type="text"
                label="First Name"
                value={step2.firstName}
                onChange={(e) =>
                  setStep2({ ...step2, firstName: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="text"
                label="Last Name"
                value={step2.lastName}
                onChange={(e) =>
                  setStep2({ ...step2, lastName: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="text"
                label="Address 1"
                value={step2.address1}
                onChange={(e) =>
                  setStep2({ ...step2, address1: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="text"
                label="Address 2 (optional)"
                value={step2.address2}
                onChange={(e) =>
                  setStep2({ ...step2, address2: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="text"
                label="Postcode"
                value={step2.postcode}
                onChange={(e) =>
                  setStep2({ ...step2, postcode: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <Input
                type="text"
                label="City"
                value={step2.city}
                onChange={(e) =>
                  setStep2({ ...step2, city: e.currentTarget.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex w-full flex-row gap-4">
                <Button
                  className="flex-1"
                  onClick={() => setStep(Step.Credentials)}
                  children="Back"
                />
                <Button
                  className="flex-1"
                  onClick={handleRegister}
                  children="Register"
                />
              </div>
              <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">
                  Do you have an account?
                </p>
                <a
                  href="/login"
                  className="text-base text-blue-500 hover:underline"
                >
                  Login
                </a>
              </div>
            </div>
          )}
          <CustomDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            message="You have successfully registered."
            isVisibleButton={false}
          />
        </div>
      </SearchQueryProvider>
    </>
  );
};

export default RegisterPage;
