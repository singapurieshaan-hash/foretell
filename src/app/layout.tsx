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
      <body className="bg-brand-surface">
        <div className="flex h-screen bg-brand-surface">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto bg-brand-surface">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
