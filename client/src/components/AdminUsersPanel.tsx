import React, { useState, useEffect } from "react";
import CustomDialog from "./CustomDialog";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import type { UserDetails } from "../types/UserDetails";
import InputSmall from "./InputSmall";
import ButtonOutline from "./ButtonOutline";
import Loader from "./Loader";

const AdminUsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserDetails[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    role: "",
    first_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    post_code: "",
    city: "",
  });
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [sucesscDeleteAccountOpen, setSucesscDeleteAccountOpen] =
    useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    setError("No token found in localStorage");
    return null;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/all-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch users");
        }

        const data: UserDetails[] = await response.json();
        setUsers(data);
        console.log("Fetched users:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (selectedUser) {
      setForm({
        email: selectedUser.email || "",
        role: selectedUser.role || "",
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        address_line1: selectedUser.address_line1 || "",
        address_line2: selectedUser.address_line2 || "",
        post_code: selectedUser.post_code || "",
        city: selectedUser.city || "",
      });
    }
  }, [selectedUser]);

  const handleEditProfile = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      try {
        if (!selectedUser) {
          setError("No user selected for editing.");
          return;
        }
        const response = await fetch(
          `${API_BASE_URL}/users/${selectedUser.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          },
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to update profile");
        }
        setEditMode(false);
        setSelectedUser((prev) => (prev ? { ...prev, ...form } : null));
        setUsers((prev) =>
          prev
            ? prev.map((u) =>
                u.id === selectedUser.id ? { ...u, ...form } : u,
              )
            : null,
        );
      } catch (err: any) {
        setError(err.message || "Failed to update user profile");
      }
    }
  };

  const handleDeleteUserAccount = async () => {
    try {
      if (!selectedUser) {
        setError("No user selected for deleting.");
        return;
      }
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete user account");
      }
      setSucesscDeleteAccountOpen(true);
      setIsDeleteAccountDialogOpen(false);
      setTimeout(() => {
        setSucesscDeleteAccountOpen(false);
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 w-full">
      {!selectedUser && users && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <h2 className="text-2xl font-bold mb-4 uppercase">users list</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr className="border-b border-gray-300 w-full">
                  <th className="w-[23%] min-w-[200px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    id
                  </th>
                  <th className="w-[23%] min-w-[200px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    email
                  </th>
                  <th className="w-[23%] min-w-[200px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    first name
                  </th>
                  <th className="w-[23%] min-w-[200px] px-4 py-3 text-left text-base font-bold text-black uppercase">
                    last name
                  </th>
                  <th className="w-[8%] min-w-[80px] px-4 py-3 text-left text-base font-bold text-black uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="w-[27%] min-w-[200px] px-4 py-3 text-left text-sm text-black">
                      {user.id}
                    </td>
                    <td className="w-[27%] min-w-[200px] px-4 py-3 text-left text-sm text-black">
                      {user.email}
                    </td>
                    <td className="w-[17%] min-w-[200px] px-4 py-3 text-left text-sm text-black">
                      {user.first_name || "N/A"}
                    </td>
                    <td className="w-[21%] min-w-[200px] px-4 py-3 text-left text-sm text-black">
                      {user.last_name || "N/A"}
                    </td>
                    <td className="w-[8%] min-w-[80px] px-4 py-3 text-left text-sm text-blue-900">
                      View more
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!editMode && selectedUser && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <h2 className="text-2xl font-bold mb-4 uppercase">user details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <tbody>
                <tr>
                  <th className="text-left px-4 py-3 w-1/5">ID</th>
                  <td className="px-4 py-3">{selectedUser.id}</td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Email</th>
                  <td className="px-4 py-3">{selectedUser.email}</td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Role</th>
                  <td className="px-4 py-3">{selectedUser.role}</td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">First Name</th>
                  <td className="px-4 py-3">
                    {selectedUser.first_name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Last Name</th>
                  <td className="px-4 py-3">
                    {selectedUser.last_name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Address Line 1</th>
                  <td className="px-4 py-3">
                    {selectedUser.address_line1 || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Address Line 2</th>
                  <td className="px-4 py-3">
                    {selectedUser.address_line2 || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Post Code</th>
                  <td className="px-4 py-3">
                    {selectedUser.post_code || "N/A"}
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">City</th>
                  <td className="px-4 py-3">{selectedUser.city || "N/A"}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-row gap-4 col-span-2">
              <ButtonOutline
                className="m-4"
                onClick={() => setIsDeleteAccountDialogOpen(true)}
                children="delete user"
              />

              <ButtonOutline
                className="m-4"
                onClick={() => setEditMode(true)}
                children="edit user"
              />
              <ButtonOutline
                className="m-4"
                onClick={() => {
                  setSelectedUser(null);
                  setEditMode(false);
                }}
                children="close"
              />
            </div>
          </div>
        </div>
      )}
      {editMode && selectedUser && (
        <div className="flex flex-col w-full border-2 border-gray-300 p-8 rounded-sm">
          <h2 className="text-2xl font-bold mb-4 uppercase">user details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <tbody>
                <tr>
                  <th className="text-left px-4 py-3 w-1/5">ID</th>
                  <td className="px-4 py-3">{selectedUser.id}</td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Email</th>
                  <td>
                    <InputSmall
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Role</th>
                  <td>
                    <InputSmall
                      type="text"
                      value={form.role}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, role: e.target.value }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">First Name</th>
                  <td>
                    <InputSmall
                      type="text"
                      value={form.first_name || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, first_name: e.target.value }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Last Name</th>
                  <td>
                    <InputSmall
                      type="text"
                      value={form.last_name || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, last_name: e.target.value }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Address Line 1</th>
                  <td>
                    <InputSmall
                      type="text"
                      value={form.address_line1 || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          address_line1: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Address Line 2</th>
                  <td>
                    {" "}
                    <InputSmall
                      type="text"
                      value={form.address_line2 || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          address_line2: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">Post Code</th>
                  <td>
                    <InputSmall
                      type="text"
                      value={form.post_code || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, post_code: e.target.value }))
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th className="text-left px-4 py-3">City</th>
                  <td>
                    {" "}
                    <InputSmall
                      type="text"
                      value={form.city || "N/A"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-row gap-4 col-span-2">
              <ButtonOutline
                className="m-4"
                onClick={() => {
                  setSelectedUser(null);
                  setEditMode(false);
                }}
                children="close"
              />

              <ButtonOutline
                className="m-4"
                onClick={handleEditProfile}
                children="save changes"
              />
            </div>
          </div>
        </div>
      )}
      {error && (
        <CustomDialog
          isOpen={true}
          onClose={() => navigate("/admin/dashboard")}
          message={error}
          isVisibleButton={false}
        />
      )}
      <CustomDialog
        isOpen={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        message={`Are you sure you want to delete account for ${selectedUser ? selectedUser.email : ""}?`}
        buttonTitle="delete"
        buttonOutlineTitle="cancel"
        onClickButton={handleDeleteUserAccount}
        isVisibleButton={true}
      />
      <CustomDialog
        isOpen={sucesscDeleteAccountOpen}
        onClose={() => setSucesscDeleteAccountOpen(false)}
        message={`You have successfully deleted account for ${selectedUser ? selectedUser.email : ""}?`}
        isVisibleButton={false}
      />
    </div>
  );
};

export default AdminUsersPanel;
