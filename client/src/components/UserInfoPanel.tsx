import React, { useEffect, useState } from "react";
import type { UserDetails } from "../types/UserDetails";
import Loader from "./Loader";
import { API_BASE_URL } from "../config";
import Input from "./Input";
import ButtonOutline from "./ButtonOutline";
import CustomDialog from "./CustomDialog";
import { Check } from "lucide-react";

const UserInfoPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address_line1: "",
    address_line2: "",
    post_code: "",
    city: "",
  });

  const isGoogleAccount = !!userData?.is_google_account;

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (isPasswordDialogOpen) {
      const timer = setTimeout(() => setIsPasswordDialogOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isPasswordDialogOpen]);

  const handleEditProfile = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to update profile");
        }
        setEditMode(false);
        setUserData((prev) => (prev ? { ...prev, ...form } : null));
      } catch (err: any) {
        setError(err.message || "Failed to update profile");
      }
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("Password and confirmation do not match");
      return;
    }
    if (passwords.new_password.length < 8) {
      setPasswordError("Minimum 8 characters");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/me/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_password: passwords.new_password,
          confirm_password: passwords.confirm_password,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.detail || "Failed to set password");
      setIsPasswordDialogOpen(true);
      setEditPasswordMode(false);
      setUserData((prev) =>
        prev ? { ...prev, is_google_account: false } : prev,
      );
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordError(null);
    } catch (err: any) {
      setPasswordError(err.message || "Password setup error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (passwords.new_password.length < 8) {
      setPasswordError("Минимум 8 символов");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.detail || "Failed to change password");
      setIsPasswordDialogOpen(true);
      setEditPasswordMode(false);
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordError(null);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          //  "Content-Type": "application/json",
        },
        //  body: JSON.stringify({ current_password: passwords.current_password })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete account");
      }
      alert("Account deleted successfully.");
      window.location.href = "/login"; // Redirect to login page
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return;
  <CustomDialog
    isOpen={true}
    onClose={() => setError(null)}
    message={`Error: ${error}`}
  />;
  if (!userData) return null;

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-row justify-between ">
        <div className="flex flex-col gap-4 w-[49%] border-2 border-gray-300 p-8 rounded-sm">
          <div className="flex flex-row gap-4">
            <Input
              label="First Name"
              type="text"
              value={form.first_name}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
            />
            <Input
              label="Last Name"
              type="text"
              value={form.last_name}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
            />
          </div>
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            disabled={!editMode}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <div className="flex flex-row gap-4">
            <Input
              label="Address Line 1"
              type="text"
              value={form.address_line1}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, address_line1: e.target.value }))
              }
            />
            <Input
              label="Address Line 2"
              type="text"
              value={form.address_line2}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, address_line2: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-row gap-4">
            <Input
              label="Post Code"
              type="text"
              value={form.post_code}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, post_code: e.target.value }))
              }
            />
            <Input
              label="City"
              type="text"
              value={form.city}
              disabled={!editMode}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <ButtonOutline className="w-full mt-4" onClick={handleEditProfile}>
            {editMode ? "Save changes" : "Edit profile"}
          </ButtonOutline>
        </div>
        <div className="flex flex-row gap-4 h-fit w-[49%] border-2 border-gray-300 p-8 rounded-sm">
          {!editPasswordMode ? (
            isGoogleAccount ? (
              <ButtonOutline
                className=" w-full"
                onClick={() => setEditPasswordMode(true)}
              >
                Set password
              </ButtonOutline>
            ) : (
              <>
                <Input
                  label="Password"
                  type="password"
                  value="********"
                  className="w-[60%]"
                  disabled
                />
                <ButtonOutline
                  className="w-[40%]"
                  onClick={() => setEditPasswordMode(true)}
                >
                  Change password
                </ButtonOutline>
              </>
            )
          ) : isGoogleAccount ? (
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSetPassword}
            >
              <div className="mb-5">
                <Input
                  label="New password"
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      new_password: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
                <div className="text-sm text-black flex items-center gap-2 pt-0">
                  <Check /> 8 characters minimum
                </div>
              </div>
              <Input
                label="Confirm new password"
                type="password"
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords((p) => ({
                    ...p,
                    confirm_password: e.target.value,
                  }))
                }
                disabled={loading}
              />
              {passwordError && (
                <div className="text-red-500 text-xs ">{passwordError}</div>
              )}
              <div className="flex flex-row gap-2 mt-2">
                <ButtonOutline
                  type="submit"
                  className="w-[50%]"
                  disabled={loading}
                >
                  Set password
                </ButtonOutline>
                <ButtonOutline
                  type="button"
                  className="w-[50%]"
                  onClick={() => {
                    setEditPasswordMode(false);
                    setPasswords({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                    setPasswordError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </ButtonOutline>
              </div>
            </form>
          ) : (
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleEditPassword}
            >
              <Input
                label="Current password"
                type="password"
                value={passwords.current_password}
                onChange={(e) =>
                  setPasswords((p) => ({
                    ...p,
                    current_password: e.target.value,
                  }))
                }
                disabled={loading}
              />
              <div className="mb-5">
                <Input
                  label="New password"
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      new_password: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
                <div className="text-sm text-black flex items-center gap-2 pt-0">
                  <Check /> 8 characters minimum
                </div>
              </div>
              <Input
                label="Confirm password"
                type="password"
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords((p) => ({
                    ...p,
                    confirm_password: e.target.value,
                  }))
                }
                disabled={loading}
              />
              {passwordError && (
                <div className="text-red-500 text-xs ">{passwordError}</div>
              )}
              <div className="flex flex-row gap-2 mt-2">
                <ButtonOutline
                  type="submit"
                  className="w-[50%]"
                  disabled={loading}
                >
                  Save
                </ButtonOutline>
                <ButtonOutline
                  type="button"
                  className="w-[50%]"
                  onClick={() => {
                    setEditPasswordMode(false);
                    setPasswords({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                    setPasswordError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </ButtonOutline>
              </div>
            </form>
          )}
        </div>
      </div>
      <ButtonOutline 
        children="delete account" 
        className="w-fit" 
        onClick={handleDeleteAccount}/>
      <CustomDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        message={
          isGoogleAccount
            ? "Password set successfully!"
            : "Password changed successfully!"
        }
        isVisibleButton={false}
      />
    </div>
  );
};

export default UserInfoPanel;
