import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () =>{
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            sessionStorage.setItem("token", token);
            navigate("/"); // или главная страница после входа
        } else {
            navigate("/login"); // если токена нет
        }
    }, []);

    return <p>Завершаем вход через Google...</p>;
}

export default Welcome;
