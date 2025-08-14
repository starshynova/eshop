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
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line1: "",
    address_line2: "",
    post_code: "",
    city: "",
  });

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

  useEffect(() => {
    if (userData) {
      setForm({
        first_name: userData.first_name ?? "",
        last_name: userData.last_name ?? "",
        email: userData.email ?? "",
        address_line1: userData.address_line1 ?? "",
        address_line2: userData.address_line2 ?? "",
        post_code: userData.post_code ?? "",
        city: userData.city ?? "",
      });
    }
  }, [userData]);

  const handleEditProfile = async () => {
          if (!editMode) {
            setEditMode(true);
          } else {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(form),
              });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to update profile");
              }
              setEditMode(false);
              setUserData((prev) => prev ? { ...prev, ...form } : null);

            } catch (err: any) {
              console.error("Error updating profile:", err);
            }
          }
        }

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
    // <div className="flex flex-col gap-12 w-full">
    //   <div className="flex flex-row justify-between ">
    //     <div className="flex flex-col gap-4 w-[49%] border-2 border-gray-300 p-8 rounded-sm">
    //       <div className="flex flex-row gap-4">
    //         <Input
    //           label="First Name"
    //           type="text"
    //           value={userData.first_name}
    //           className="focus:font-bold"
    //         />
    //         <Input
    //           label="Last Name"
    //           type="text"
    //           value={userData.last_name}
    //           className="focus:font-bold"
    //         />
    //       </div>

    //       <Input label="E-mail" type="email" value={userData.email} />
    //       <div className="flex flex-row gap-4">
    //         <Input
    //           label="Address Line 1"
    //           type="text"
    //           value={userData.address_line1}
    //         />
    //         <Input
    //           label="Address Line 2"
    //           type="text"
    //           value={userData.address_line2}
    //         />
    //       </div>
    //       <div className="flex flex-row gap-4">
    //         <Input label="Post Code" type="text" value={userData.post_code} />
    //         <Input label="City" type="text" value={userData.city} />
    //       </div>
    //       <ButtonOutline
    //         className="w-full mt-4 h-[48px]"
    //         onClick={() => alert("Update functionality not implemented yet")}
    //         children="edit profile"
    //       />
    //     </div>
    //     <div className="flex flex-row gap-4 h-fit w-[49%] border-2 border-gray-300 p-8 rounded-sm">
    //       <Input
    //         label="Password"
    //         type="password"
    //         value="********"
    //         className="w-[60%]"
    //       />
    //       <ButtonOutline
    //         children="change password"
    //         className="h-[48px] w-[40%]"
    //       />
    //     </div>
    //   </div>
    //   <ButtonOutline children="delete account" className="w-fit" />
    // </div>
    <div className="flex flex-col gap-12 w-full">
  <div className="flex flex-row justify-between ">
    <div className="flex flex-col gap-4 w-[49%] border-2 border-gray-300 p-8 rounded-sm">
      <div className="flex flex-row gap-4">
        <Input
          label="First Name"
          type="text"
          value={form.first_name}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
        />
        <Input
          label="Last Name"
          type="text"
          value={form.last_name}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
        />
      </div>
      <Input
        label="E-mail"
        type="email"
        value={form.email}
        disabled={!editMode}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <div className="flex flex-row gap-4">
        <Input
          label="Address Line 1"
          type="text"
          value={form.address_line1}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))}
        />
        <Input
          label="Address Line 2"
          type="text"
          value={form.address_line2}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))}
        />
      </div>
      <div className="flex flex-row gap-4">
        <Input
          label="Post Code"
          type="text"
          value={form.post_code}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, post_code: e.target.value }))}
        />
        <Input
          label="City"
          type="text"
          value={form.city}
          disabled={!editMode}
          onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
        />
      </div>
      <ButtonOutline
        className="w-full mt-4 h-[48px]"
        onClick={handleEditProfile}
        children={editMode ? "save changes" : "edit profile"}
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
