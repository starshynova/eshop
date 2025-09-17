import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Button from "./Button";
import CustomDialog from "./CustomDialog";
import { useNavigate } from "react-router-dom";

const StripeCheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment/success",
      },
    });

    if (error) setError(error.message ?? "Payment error");
    setLoading(false);
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null);
      navigate("/cart");
    }, 2000);

    return () => clearTimeout(timer);
  }, [error, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-8" />
      <Button
        className="w-full"
        disabled={loading}
        type="submit"
        children={loading ? "Processing..." : "Pay"}
      />
      {error && (
        <CustomDialog
          isOpen={true}
          onClose={() => navigate("/cart")}
          message={error}
          isVisibleButton={false}
        />
      )}
    </form>
  );
};

export default StripeCheckoutForm;
