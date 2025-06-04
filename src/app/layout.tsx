import "./globals.css";
import { Inter } from "next/font/google";
import { Vazirmatn } from "next/font/google";
import { Providers } from "../store/providers"; // مسیر صحیح کامپوننت Providers

const inter = Inter({ subsets: ["latin"] });

const vazirmatn = Vazirmatn({
  subsets: ["arabic"], // Vazirmatn معمولاً subset arabic رو داره
  weight: ["400", "700"], // وزن‌های مورد نیاز
});


export const metadata = {
  title: "اپلیکیشن مدیریت کاربران", // عنوان فارسی
  description: "یک اپلیکیشن ساده مدیریت کاربران با Next.js و Redux", // توضیحات فارسی
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>

          {children}
        </Providers>
      </body>
    </html>
  );
}
