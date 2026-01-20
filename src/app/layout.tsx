import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import "@/globals.css";

export const metadata = {
  title: "Foretell | Premium Prediction Markets",
  description: "Trade predictions on the world's most important events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
