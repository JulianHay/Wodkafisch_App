import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../../components/footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NavbarFisch } from "../../components/navbar";
import { useRouter } from "next/navigation";
import { StateProvider } from "@/lib/provider";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wodkafisch",
  description: "Hoist the sails of adventure",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StateProvider>
          <div
            style={{
              flexDirection: "column",
              minHeight: "100vh",
              display: "flex",
            }}
          >
            <NavbarFisch />
            <main
              style={{
                flex: 1,
                backgroundColor: "#000022ff",
              }}
            >
              {children}
            </main>
            <Footer />
          </div>
        </StateProvider>
      </body>
    </html>
  );
}
