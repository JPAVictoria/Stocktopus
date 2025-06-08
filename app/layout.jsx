import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/app/context/LoaderContext";
import { SnackbarProvider } from "@/app/context/SnackbarContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Stocktopus",
    template: "%s | Stocktopus",
  },
  description: "Stocktopus is a smart inventory management system to track, transfer, and analyze product stock in real-time.",
  keywords: [
    "Inventory Management",
    "Stock Tracking",
    "Warehouse System",
    "Product Transfer",
    "Stock Analytics",
    "Stocktopus",
    "Inventory App",
    "Warehouse App",
    "Next.js Inventory",
  ],
  authors: [
    {
      name: "Andre Victoria",
      url: "https://andre-victoria.vercel.app/",
    },
  ],
  creator: "Andre Victoria",
  openGraph: {
    title: "Stocktopus - Smart Inventory Management",
    description: "Easily add, subtract, and transfer products while gaining insights through detailed analytics. Stocktopus simplifies inventory control.",
    url: "https://stocktopus.vercel.app",
    siteName: "Stocktopus",
    images: [
      {
        url: "https://stocktopus.vercel.app/octopus.png", 
        width: 1200,
        height: 630,
        alt: "Stocktopus - Inventory Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/octopus.png",
  },
};

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
