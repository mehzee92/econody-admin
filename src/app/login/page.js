"use client"

import { useState, useEffect } from "react";
import { adminLogin, checkToken  } from "@/components/utils";
import useUserStore from "@/stores/userStore";
import useAssetsStore from "@/stores/assetsStore";

const LoginForm = () => {

  const { login, isLoggedIn } = useUserStore();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    pin: "",
    token: ""
  });


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const result = await adminLogin("/api/auth-admin/login", formData);
    if(result.status=="success") 
    {
       sessionStorage.setItem("accessToken", result.accessToken);
       sessionStorage.setItem("refreshToken", result.refreshToken);
       login(result);
       
    }
  };

  const checkForAlreadyLogin=async()=>{
      const result = await checkToken();
      if(!isLoggedIn && result.status=='success') 
      {
        login(result);
      }   
  }

  useEffect(()=>{
    checkForAlreadyLogin();
  });


  return (
    <div className="flex items-center justify-center p-4" style={{height:"calc(100vh - 150px)"}}>
      <form
        onSubmit={handleSubmit}
        style = {{ border:"solid 1px #00000040"}}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-3"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Econody Secure Login {isLoggedIn}
        </h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="pin">
            PIN
          </label>
          <input
            type="password"
            name="pin"
            id="pin"
            maxLength={6}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.pin}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="token">
            TOTP
          </label>
          <input
            type="text"
            name="token"
            id="token"
            maxLength={6}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.token}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
