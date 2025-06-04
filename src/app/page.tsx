"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchUsers } from "../store/usersSlice";
import Link from "next/link";

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  // currentPage و totalPages رو از useSelector حذف می‌کنیم
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers()); // <-- حالا بدون پارامتر currentPage
    }
  }, [status, dispatch]); // currentPage از Dependency Array هم حذف شد

  const handleReload = () => {
    dispatch(fetchUsers()); // <-- حالا بدون پارامتر currentPage
  };

  // تابع handlePageChange و بخش Pagination UI حذف میشن چون دیگه صفحه بندی نداریم
  // const handlePageChange = (page: number) => {
  //   dispatch(fetchUsers(page));
  // };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        در حال بارگذاری...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        ارور: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">لیست کاربران</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleReload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          بارگذاری مجدد کاربران
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
          >
            <img
              src={user.avatar}
              alt={user.first_name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl text-black font-semibold mb-2">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <Link
              href={`/user/${user.id}`}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-auto"
            >
              جزيیات کاربر
            </Link>
          </div>
        ))}
      </div>


    </div>
  );
};

export default HomePage;
