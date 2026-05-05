"use client";

import { Toaster } from "react-hot-toast";
import SessionProvider from "./SessionProvider";
import { CartProvider } from "./CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#e8d5b7",
              border: "1px solid #c9a96e",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#c9a96e", secondary: "#1a1a2e" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#1a1a2e" } },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
