import { UserProvider } from "@auth0/nextjs-auth0/client";
import "@jecfe/react-design-system/src/tailwind.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Book Repo",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={`${poppins.variable} flex min-h-screen flex-col bg-slate-900 font-poppins`}
        >
          <Toaster position="top-right" reverseOrder={false} />
          <div>{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
