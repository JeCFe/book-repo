import { UserProvider } from "@auth0/nextjs-auth0/client";
import {
  Footer,
  Header,
  JecfeLogo,
  JecfeLogoBlack,
  NextUser,
} from "@jecfe/react-design-system";
import "@jecfe/react-design-system/src/tailwind.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

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
        <body className="flex min-h-screen flex-col bg-slate-900 font-poppins">
          <div className="container mx-auto flex-1">{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
