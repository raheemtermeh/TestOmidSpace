import "./globals.css";
import { Inter } from "next/font/google";
import { Vazirmatn } from "next/font/google";
import { Providers } from "../store/providers"; 

const inter = Inter({ subsets: ["latin"] });

const vazirmatn = Vazirmatn({
  subsets: ["arabic"], 
  weight: ["400", "700"], 
});


export const metadata = {
  title: "اپلیکیشن مدیریت کاربران", 
  description: " اپلیکیشن مدیریت کاربران  ", 
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
