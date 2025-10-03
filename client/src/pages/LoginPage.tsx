import { useState, useEffect } from "react";
import Header from "../components/Header";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import Button from "../components/Button";
import ButtonOutline from "../components/ButtonOutline";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import CustomDialog from "../components/CustomDialog";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useCart } from "../context/CartContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { refresh } = useCart();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        throw new Error(`Login failed: ${response.status}`);
      } else {
        await login(data.token);
        setIsOpen(true);
        await refresh();
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/users/oauth/google/login`;
  };

  if (error) {
    return (
      <CustomDialog
        isOpen={true}
        onClose={() => setError(null)}
        message={error}
        isVisibleButton={false}
      />
    );
  }

  return (
    <>
      <SearchQueryProvider>
        <Header />
        <div className="w-full h-full absolute top-[100px]">
          <div className="w-[30%] max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg justify-center items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Login</h2>
              <Input
                label="E-mail"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              {error && (
                <p className="self-start text-red-600 text-sm mb-5">{error}</p>
              )}
              <Button
                className="w-full"
                onClick={handleLogin}
                children="Log In"
              />
              <ButtonOutline
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="w-5 h-5" />
                <span>Log In with Google</span>
              </ButtonOutline>

              <div className="flex flex-row gap-3 mt-7 w-full justify-center">
                <p className="text-base text-gray-700">
                  Don't have an account?
                </p>
                <a
                  href="/register"
                  className="text-base text-blue-500 hover:underline"
                >
                  Signup
                </a>
              </div>
            </div>
            <CustomDialog
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              message="You have successfully logged in."
              isVisibleButton={false}
            />
          </div>
        </div>
      </SearchQueryProvider>
    </>
  );
};

export default LoginPage;
