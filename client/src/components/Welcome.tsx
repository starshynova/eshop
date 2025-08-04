import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () =>{
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            setTimeout(() => {
                navigate("/");
            }, 200);
        } else {
            navigate("/login"); // если токена нет
        }
    }, [navigate]);

    return <p>Завершаем вход через Google...</p>;
}

export default Welcome;
