"use client"; 

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // تغییر next/router به next/navigation برای App Router
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store"; // RootState از اینجا لازم نیست چون مستقیم state رو سلکت نمیکنیم
import { deleteUser, updateUser } from "@/store/usersSlice";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserDetailPageProps {
  params: {
    id: string;
  };
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

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://reqres.in/api/users/${params.id}`,
          {
            headers: {
              "x-api-key": "reqres-free-v1",
            },
          }
        );
        setUser(response.data.data);
      } catch (err: any) {
        console.error("خطا در دریافت جزئیات کاربر:", err.message);
        setError(
          err.response?.status === 404
            ? "کاربر یافت نشد."
            : "خطا در بارگذاری جزئیات کاربر."
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleDelete = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) {
      if (user) {
        dispatch(deleteUser(user.id));
        router.push("/");
      }
    }
  };

  const handleEditSubmit = (updatedUserData: Partial<User>) => {
    if (user) {
      dispatch(updateUser({ ...user, ...updatedUserData })); 
      setUser((prev) =>
        prev ? ({ ...prev, ...updatedUserData } as User) : null
      );
      setIsEditModalOpen(false); // Close the modal after submission
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-300 bg-gray-900">
        در حال بارگذاری جزئیات کاربر...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500 bg-gray-900">
        خطا: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-400 bg-gray-900">
        کاربر مورد نظر یافت نشد.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-900 text-gray-100 py-8">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-gray-700">
        <h1 className="text-3xl text-blue-400 font-extrabold mb-6">
          جزئیات کاربر
        </h1>
        <img
          src={user.avatar}
          alt={user.first_name}
          className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500 shadow-md"
        />
        <p className="text-3xl font-bold mb-2 text-white">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-blue-300 text-xl mb-6 font-light">{user.email}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-200 transform hover:scale-105 flex-grow sm:flex-initial"
          >
            ویرایش کاربر
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-200 transform hover:scale-105 flex-grow sm:flex-initial"
          >
            حذف کاربر
          </button>
        </div>

        <Link
          href="/"
          className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg text-md mt-8 transition duration-200 transform hover:scale-105"
        >
          بازگشت به لیست کاربران
        </Link>
      </div>

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={user}
      />
    </div>
  );
}
