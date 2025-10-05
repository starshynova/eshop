import { API_BASE_URL } from "../config";

export const CART_KEY = "cart_guest";

export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

export const getLocalCartCount = () => {
  return getLocalCart().reduce(
    (sum: number, item: { productId: string; quantity: number }) =>
      sum + item.quantity,
    0,
  );
};

export const addToLocalCartWithStockCheck = async (
  productId: string,
  quantity = 1,
) => {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`);
  if (!res.ok) {
    return { success: false, error: "Failed to get product information" };
  }
  const product = await res.json();

  const stock = product.stock ?? 0;
  if (stock <= 0) {
    return { success: false, error: "Out of stock" };
  }

  const cart = getLocalCart();
  const idx = cart.findIndex(
    (item: { productId: string; quantity: number }) =>
      item.productId === productId,
  );
  let newQuantity = quantity;
  if (idx !== -1) {
    newQuantity += cart[idx].quantity;
  }

  if (newQuantity > stock) {
    return {
      success: false,
      error: `You cannot add more than ${stock}. Only in stock ${stock}`,
    };
  }

  if (idx !== -1) {
    cart[idx].quantity = newQuantity;
  } else {
    cart.push({ productId, quantity });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return { success: true };
};

export const setLocalCart = (
  cart: { productId: string; quantity: number }[],
) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
};
