import axios from "axios";
import Link from "next/link";


async function getUser(id: string) {
  try {
    const response = await axios.get(`https://reqres.in/api/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
}

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await getUser(params.id);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
       خطا در دریافت اطلاعات کاربر
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-screen justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl text-black font-bold mb-6">جزییات کاربر</h1>
        <img
          src={user.avatar}
          alt={user.first_name}
          className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
        />
        <p className="text-2xl font-semibold text-black mb-2">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-blue-700 text-lg mb-4">{user.email}</p>

        <Link
          href="/"
          className="inline-block mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          برگشت به لیست کاربران
        </Link>
      </div>
    </div>
  );
}
