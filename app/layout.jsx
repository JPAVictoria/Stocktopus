import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/app/context/LoaderContext";
import { SnackbarProvider } from "@/app/context/SnackbarContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <LoadingProvider>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
