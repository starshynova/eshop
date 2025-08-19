// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../config";
// import Loader from "../components/Loader";

// const SuccessPage: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

// //   useEffect(() => {
// //     const sendCheckout = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch(`${API_BASE_URL}/orders/checkout-success`, {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         if (!res.ok) throw new Error("Order processing error");
// //       } catch (err: any) {
// //         setError(err.message || "Unknown error");
// //       }
// //       setLoading(false);
// //     };
// //     sendCheckout();
// //   }, []);

//     useEffect(() => {
//       const sendCheckout = async () => {
//         setLoading(true);
//         try {
//           const res = await fetch(`${API_BASE_URL}/orders/checkout-success`, {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (!res.ok) {
//             // Парсим JSON-ошибку
//             let errorText = "Order processing error";
//             try {
//               const data = await res.json();
//               if (data.detail) errorText = data.detail;
//             } catch (_) {
//               // ignore
//             }
//             throw new Error(errorText);
//           }
//         } catch (err: any) {
//           setError(err.message || "Unknown error");
//         }
//         setLoading(false);
//       };
//       sendCheckout();
//     }, []);


//   if (loading) return <Loader />;
//   if (error)
//     return (
//       <div>
//         <h2>Ошибка: {error}</h2>
//         <button onClick={() => navigate("/")}>На главную</button>
//       </div>
//     );
//   return (
//     <div>
//       <h1>Платёж прошёл успешно!</h1>
//       <p>Ваш заказ оформлен.</p>
//       <button onClick={() => navigate("/")}>На главную</button>
//     </div>
//   );
// };
// export default SuccessPage;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Loader from "../components/Loader";

const PaymentSuccessPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

//   useEffect(() => {
//     const sendCheckout = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE_URL}/orders/checkout-success`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) {
//           let errorText = "Order processing error";
//           try {
//             const data = await res.json();
//             if (data.detail) errorText = data.detail;
//           } catch (_) {}
//           throw new Error(errorText);
//         }
//       } catch (err: any) {
//         setError(err.message || "Unknown error");
//       }
//       setLoading(false);
//     };
//     sendCheckout();
//   }, []);

//   if (loading) return <Loader />;
//   if (error)
//     return (
//       <div>
//         <h2>Ошибка: {error}</h2>
//         <button onClick={() => navigate("/")}>На главную</button>
//       </div>
//     );
  return (
    <div>
      <h1>Платёж прошёл успешно!</h1>
      <p>Ваш заказ оформлен.</p>
      <button onClick={() => navigate("/")}>На главную</button>
    </div>
  );
};
export default PaymentSuccessPage;
