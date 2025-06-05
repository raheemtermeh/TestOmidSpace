"use client";

import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username === "test" && password === "password") {
      onLogin(username, password);
      onClose();
    } else {
      setError("نام کاربری یا رمز عبور نامعتبر است."); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          ورود
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              نام کاربری:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              رمز عبور:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition duration-200 transform hover:scale-105"
            >
              ورود
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 font-bold text-sm transition duration-200"
            >
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
