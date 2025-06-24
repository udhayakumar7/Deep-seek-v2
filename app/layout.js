import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "./context/AppContext";
 import { Toaster } from "react-hot-toast"; 
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
        <Toaster />
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}
