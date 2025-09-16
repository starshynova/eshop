// import API_BASE_URL from "../config";

// const addToCart = async (productId: string, stock: number) => {
//   if (!productId || stock <= 0) {
//     console.error("Invalid product ID or stock");
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
//         stock: stock,
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
