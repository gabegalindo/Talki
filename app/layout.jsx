import "./globals.css";
import Toolbar from "./components/Toolbar";

export const metadata = {
  title: "Talki",
  description: "Your friendly AI chat companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toolbar />
      </body>
    </html>
  );
}
