import React, { useState, useEffect } from "react";
import CustomDialog from "./CustomDialog";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import type { UserDetails } from "../types/UserDetails";

const AdminUsersPanel: React.FC = () => {
  const [users, setUsers] = useState<UserDetails[] | null>(null);

  const [error, setError] = useState<string | null>(null);
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

  return (
    <div className="p-4 w-full">
      <div className="flex flex-col w-[80%] border-2 border-gray-300 p-8 rounded-sm">
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
              {users &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/admin/user/${user.id}`)}
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
      {error && (
        <CustomDialog
          isOpen={true}
          onClose={() => navigate("/admin/dashboard")}
          message={error}
          isVisibleButton={false}
        />
      )}
    </div>
  );
};

export default AdminUsersPanel;
