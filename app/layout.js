// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-body">{children}</body>
    </html>
  );
}