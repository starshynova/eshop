import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      setTimeout(() => {
        navigate("/");
      }, 200);
    } else {
      navigate("/login"); // если токена нет
    }
  }, [navigate]);

  return <p>Завершаем вход через Google...</p>;
};

export default Welcome;
