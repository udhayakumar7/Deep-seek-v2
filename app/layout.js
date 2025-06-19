import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "./context/AppContext";

const inter = Inter({
  variable: "--font-inder",
  subsets: ["latin"],
});


export const metadata = {
  title: "DeepSeek Clone",
  description: "Created by create next app",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider>
      <AppContextProvider>
    <html lang="en">
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}
