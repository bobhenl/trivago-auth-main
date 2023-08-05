// Import global styles
import "../style/globals.css";

// Define metadata for the page (title and description)
export const metadata = {
  title: "Log in or create an account - trivago",
  // description: "",
};

export default function RootLayout({ children }) {
  return (
    // Root HTML structure
    <html lang="en">
      <body className={"bg-white font-primary"}>{children}</body>
    </html>
  );
}
