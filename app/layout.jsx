import "./globals.css";
import QueryWrapper from "./auth/QueryWrapper";
import Nav from "./auth/Nav";
import { Roboto } from "@next/font/google";
import EmailInput from "@/app/components/EmailInput";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`mx-4 md:mx-48 xl:mx-96 ${roboto.variable} bg-gray-200`}>
        <QueryWrapper>
          <Nav />
          {children}
          <EmailInput />
          <Link href="/filter">
            <button className="text-sm bg-gray-700 text-white py-2 px-6 rounded-md disabled:opacity-25">
              Go to Filter Page
            </button>
          </Link>
        </QueryWrapper>
      </body>
    </html>
  );
}
