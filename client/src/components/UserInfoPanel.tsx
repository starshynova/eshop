import React, { useEffect, useMemo, useState } from "react";
import type { UserDetails } from "../types/UserDetails";
import Loader from "./Loader";
import API_BASE_URL from "../config";
import Input from "./Input";
import ButtonOutline from "./ButtonOutline";

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
        if (e?.name !== "AbortError")
          setError(e?.message ?? "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [userId]);

  // const fullName = useMemo(() => {
  //   if (!userData) return "";
  //   const { first_name, last_name, email } = userData;
  //   const name = [first_name, last_name].filter(Boolean).join(" ").trim();
  //   return name || email;
  // }, [userData]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">Ошибка: {error}</div>;
  if (!userData) return null;

  return (
    // <article className="space-y-2">
    //   <h2 className="text-xl font-semibold">{fullName}</h2>
    //   <div className="text-gray-700">{userData.email}</div>

    //   {/* если нужны адресные поля, выводи с проверками */}
    // </article>
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-row justify-between ">
        <div className="flex flex-col gap-4 w-[49%] border-2 border-gray-300 p-8 rounded-sm">
          <div className="flex flex-row gap-4">
            <Input
              label="First Name"
              type="text"
              value={userData.first_name}
              className="focus:font-bold"
            />
            <Input
              label="Last Name"
              type="text"
              value={userData.last_name}
              className="focus:font-bold"
            />
          </div>

          <Input label="E-mail" type="email" value={userData.email} />
          <div className="flex flex-row gap-4">
            <Input
              label="Address Line 1"
              type="text"
              value={userData.address_line1}
            />
            <Input
              label="Address Line 2"
              type="text"
              value={userData.address_line2}
            />
          </div>
          <div className="flex flex-row gap-4">
            <Input label="Post Code" type="text" value={userData.post_code} />
            <Input label="City" type="text" value={userData.city} />
          </div>
          <ButtonOutline
            className="w-full mt-4 h-[48px]"
            onClick={() => alert("Update functionality not implemented yet")}
            children="edit profile"
          />
        </div>
        <div className="flex flex-row gap-4 h-fit w-[49%] border-2 border-gray-300 p-8 rounded-sm">
          <Input
            label="Password"
            type="password"
            value="********"
            className="w-[60%]"
          />
          <ButtonOutline
            children="change password"
            className="h-[48px] w-[40%]"
          />
        </div>
      </div>
      <ButtonOutline children="delete account" className="w-fit" />
    </div>
  );
};

export default UserInfoPanel;
