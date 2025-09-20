export const CART_KEY = "cart_guest";

export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export const getLocalCartCount = () => {
  return getLocalCart().reduce((sum: number, item: { productId: string; quantity: number }) => sum + item.quantity, 0);
}

export const addToLocalCart = (productId: string, quantity = 1) => {
  const cart = getLocalCart();
  const idx = cart.findIndex((item: { productId: string; quantity: number }) => item.productId === productId);
  if (idx !== -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export const setLocalCart = (cart: { productId: string; quantity: number }[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
