import React, { useEffect, useMemo, useState } from "react";
import type { UserDetails } from "../types/UserDetails";
import Loader from "./Loader";
import API_BASE_URL from "../config";

const UserInfoPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const ac = new AbortController();

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          signal: ac.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: UserDetails = await response.json();
        setUserData(data);
        console.log("User Data:", data);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Ошибка");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [userId]);

  const fullName = useMemo(() => {
    if (!userData) return "";
    const { first_name, last_name, email } = userData;
    const name = [first_name, last_name].filter(Boolean).join(" ").trim();
    return name || email;
  }, [userData]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">Ошибка: {error}</div>;
  if (!userData) return null;

  return (
    <article className="space-y-2">
      <h2 className="text-xl font-semibold">{fullName}</h2>
      <div className="text-gray-700">{userData.email}</div>

      {/* если нужны адресные поля, выводи с проверками */}
    </article>
  );
};

export default UserInfoPanel;
