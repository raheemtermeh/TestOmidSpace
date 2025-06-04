// src/store/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./index";

import LoginModal from "../app/components/LoginModal";

import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username: string, password: string) => {
    console.log("Logged in with:", username, password);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Provider store={store}>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">سیستم نمایش کاربران امید فضا</h1>
          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                خروج
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                ورود
              </button>
            )}
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </Provider>
  );
}
