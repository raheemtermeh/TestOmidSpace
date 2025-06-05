"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../store/usersSlice";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  initialData?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [firstName, setFirstName] = useState(initialData?.first_name || "");
  const [lastName, setLastName] = useState(initialData?.last_name || "");
  const [email, setEmail] = useState(initialData?.email || "");

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.first_name);
      setLastName(initialData.last_name);
      setEmail(initialData.email);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ first_name: firstName, last_name: lastName, email });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {initialData ? "ویرایش کاربر" : "افزودن کاربر جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              نام:
            </label>
            <input
              type="text"
              id="firstName"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              نام خانوادگی:
            </label>
            <input
              type="text"
              id="lastName"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:ring-2 focus->ring-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              ایمیل:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-900 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              لغو
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              {initialData ? "ذخیره تغییرات" : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, status, error, currentPage, totalPages, totalUsers } =
    useSelector((state: RootState) => state.users);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers(currentPage));
    }
  }, [status, dispatch, currentPage]);

  const handleReload = () => {
    dispatch(fetchUsers(currentPage));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleFormSubmit = (userData: Partial<User>) => {
    if (editingUser) {
      dispatch(updateUser({ ...editingUser, ...userData } as User));
    } else {
      dispatch(createUser(userData as Omit<User, "id" | "avatar">));
    }
    setIsFormModalOpen(false);
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchUsers(currentPage + 1));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(fetchUsers(currentPage - 1));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-300 bg-gray-900">
        در حال بارگذاری کاربران...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500 bg-gray-900">
        خطا: {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center bg-gray-900 text-gray-100 py-8">

      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400">
        لیست کاربران
      </h1>

      <div className="flex justify-between w-full max-w-5xl px-4 mb-8">
        <button
          onClick={handleAddUser}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          افزودن کاربر جدید
        </button>
        <button
          onClick={handleReload}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          بارگذاری مجدد کاربران
        </button>
      </div>

      {users.length === 0 && status === "succeeded" ? (
        <p className="text-gray-400 text-xl">کاربری یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-5xl px-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center text-center border border-gray-700 hover:border-blue-500 transition-all duration-300 ease-in-out"
            >
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-28 h-28 rounded-full mb-5 object-cover border-4 border-blue-500 shadow-md"
              />
              <h2 className="text-2xl font-bold mb-2 text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-400 mb-5 text-base font-light">
                {user.email}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-auto w-full">
                <Link
                  href={`/user/${user.id}`}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 transform hover:scale-105 flex-grow"
                >
                  مشاهده جزئیات
                </Link>
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 transform hover:scale-105 flex-grow"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 transform hover:scale-105 flex-grow"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || status === "loading"}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105"
          >
            صفحه قبلی
          </button>
          <span className="text-xl font-bold text-blue-400">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || status === "loading"}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105"
          >
            صفحه بعدی
          </button>
        </div>
      )}

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />
    </div>
  );
};

export default HomePage;
