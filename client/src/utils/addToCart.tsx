// import API_BASE_URL from "../config";

// const addToCart = async (productId: string, quantity: number) => {
//   if (!productId || quantity <= 0) {
//     console.error("Invalid product ID or quantity");
//     return;
//   }

//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("User is not logged in");
//     return;
//   }

//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${API_BASE_URL}/carts/add`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         item_id: productId,
//         quantity: quantity,
//       }),
//     });
//     const data = await response.json();
//     console.log("Add to cart response:", data);

//     if (!response.ok) {
//       throw new Error(`Error adding item to cart: ${response.status}`);
//     }

//     const countRes = await fetch(`${API_BASE_URL}/carts/count`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!countRes.ok) {
//       console.warn("Could not fetch updated cart count");
//       return;
//     }

//     const countData = await countRes.json();
//     return countData.count as number;
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     return;
//   }
// };

// export default addToCart;
