export type UserDetails = {
  id: string;
  role: string;
  email: string;
  first_name?: string;
  last_name?: string;
  address_line1?: string;
  address_line2?: string;
  post_code?: string;
  city?: string;
  password?: string;
  is_google_account?: boolean; // Optional, as some users may not have a password (e.g., Google sign-in)
};
