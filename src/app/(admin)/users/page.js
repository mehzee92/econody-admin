"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccount, readContract, writeContract } from "@wagmi/core";
import { useAccount } from "wagmi";
import { config } from "./../../wagmi";
import userBookABI from "./UserBook.json";
import { USERBOOK_CONTRACT } from "./../../../components/const";
import {
  FaUserTimes,
  FaUser,
  FaPhone,
  FaWallet,
  FaEnvelope,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

export default function UserBookDashboard() {
  const { isConnected, address } = useAccount();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const [form, setForm] = useState({
    wallet: "",
    name: "",
    contact: "",
    email: "",
    isActive: true,
  });

  // Display a temporary notification
  const showTempNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Fetch single user detail
  const getUserDetail = async (user, index) => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      const result = await readContract(config, {
        address: USERBOOK_CONTRACT,
        abi: userBookABI,
        functionName: "getUser",
        args: [user],
      });

      const wallet = {
        wallet: user,
        name: result[0].toString(),
        contact: result[1].toString(),
        email: result[2].toString(),
        dues: result[3].toString(),
        rewardsAvailable: result[4].toString(),
        isActive: result[5].toString(),
        assets: result[6].toString(),
      };

      const updatedUsers = [...users];
      updatedUsers[index] = wallet;
      setUsers(updatedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch user list.");
      showTempNotification("Failed to fetch user list.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ useCallback for stable reference
  const fetchAllUsers = useCallback(async () => {
    if (!address) return;
    try {
      setLoading(true);
      setError(null);
      const result = await readContract(config, {
        address: USERBOOK_CONTRACT,
        abi: userBookABI,
        functionName: "getAllUsers",
        args: [],
      });

      if (Array.isArray(result)) {
        let _users = result.map((user) => ({
          wallet: user.toString(),
          name: "",
          contact: "",
          email: "",
          dues: 0,
          rewardsAvailable: 0,
          assets: "",
          isActive: true,
        }));
        setUsers(_users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch user list.");
      showTempNotification("Failed to fetch user list.", "error");
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Effect with stable function ref
  useEffect(() => {
    const acc = getAccount(config);
    if (acc?.address) {
      fetchAllUsers();
    }
  }, [fetchAllUsers]);

  // Add new user
  const addUser = async () => {
    try {
      if (!form.wallet || !form.name) {
        setError("Wallet address and name are required.");
        return;
      }
      setError(null);

      const txHash = await writeContract(config, {
        address: USERBOOK_CONTRACT,
        abi: userBookABI,
        functionName: "addUser",
        args: [
          form.wallet,
          form.name,
          form.contact,
          form.email,
          form.isActive,
          [],
        ],
      });

      console.log("Transaction sent:", txHash);
      showTempNotification("User added successfully!", "success");

      setForm({
        wallet: "",
        name: "",
        contact: "",
        email: "",
        isActive: true,
      });

      // refresh list after adding
      setTimeout(() => fetchAllUsers(), 2000);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. ", err.message);
      showTempNotification("Failed to add user.", "error");
    }
  };

  // Input handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="w-full flex py-3">
      {/* Users List Section */}
      <div className="w-full px-3">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
            <FaUserTimes className="text-purple-600" />
            Users List
          </h1>

          <button
            onClick={fetchAllUsers}
            disabled={loading}
            className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Refresh List"}
          </button>
        </div>

        <p className="py-2">Admin and Manager can create new user.</p>

        {loading ? (
          <div className="text-center text-indigo-500 text-lg flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" />
            <span>Loading users...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
            <FaExclamationCircle className="mr-2 text-red-500" />
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center p-6 bg-yellow-100 text-yellow-700 rounded-lg border-l-4 border-yellow-500">
            <p className="font-semibold">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-gray-200">
                <tr className="border-b border-gray-300">
                  <th className="p-4 font-semibold text-gray-700">#</th>
                  <th className="p-4 font-semibold text-gray-700">Wallet</th>
                  <th className="p-4 font-semibold text-gray-700">Detail</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-4 text-gray-700">
                      {user.wallet}
                      {user.email ? (
                        <>
                          <div>
                            Name: <span className="font-bold">{user.name}</span>
                          </div>
                          <div>
                            Email:{" "}
                            <span className="font-bold">{user.email}</span>
                          </div>
                          <div>
                            Contact:{" "}
                            <span className="font-bold">{user.contact}</span>
                          </div>
                          <div>
                            Dues:{" "}
                            <span className="font-bold">{user.dues}</span> USDT
                          </div>
                          <div>
                            Rewards Available:{" "}
                            <span className="font-bold">
                              {user.rewardsAvailable}
                            </span>{" "}
                            USDT
                          </div>
                          <div>
                            Is Active:{" "}
                            <span className="font-bold">{user.isActive}</span>
                          </div>
                          <div>
                            Holding Assets:{" "}
                            <span className="font-bold">{user.assets}</span>
                          </div>
                        </>
                      ) : null}
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-700 truncate max-w-[120px]">
                      <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors duration-200 shadow-md flex items-center gap-1"
                        onClick={() => getUserDetail(user.wallet, index)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Notification */}
      {showNotification && (
        <div
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-xl text-white transition-opacity duration-300 z-50 ${
            notificationType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notificationMessage}
        </div>
      )}

      {/* Add User Form Section */}
      <div className="px-5  py-5 mx-4 my-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-200">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-2xl text-gray-800 font-bold flex gap-2">
            <FaUserTimes className="text-purple-600" />
            Add New User
          </h1>
          <div></div>
        </div>

        {!isConnected ? (
          <p className="text-red-500 text-center font-medium">
            Please connect your wallet to add users.
          </p>
        ) : (
          <div className="w-80">
            <div className="py-2">
              <label
                htmlFor="wallet"
                className="text-sm font-medium text-gray-700 flex mb-1 items-center"
              >
                <FaWallet className="mr-2" />
                Wallet Address
              </label>
              <input
                id="wallet"
                name="wallet"
                type="text"
                placeholder="0x..."
                value={form.wallet}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaUser className="mr-2" />
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="User Name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="contact"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaPhone className="mr-2" />
                Contact
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                placeholder="Contact Details"
                value={form.contact}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaEnvelope className="mr-2" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="py-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 mr-2 accent-blue-500 rounded-md"
              />
              <label
                htmlFor="isActive"
                className="text-gray-700 font-medium">
                User is Active
              </label>
            </div>
          </div>
        )}

        <div className="py-1 text-gray-500 ">
          Only Manager and Admin can add new user.
        </div>

        <div className="mt-3 flex justify-center">
          <button
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            onClick={addUser}
            disabled={!isConnected}
          >
            Add User
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
