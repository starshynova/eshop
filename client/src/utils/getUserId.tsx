import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
  sub: string;
  [key: string]: any;
};

export function getUserId(): string | null {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.user_id || decodedToken.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
