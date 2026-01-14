export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      {/* This wrapper ensures that if the content is short, 
        it is still centered vertically between your Navbar and Footer.
      */}
      <div className="w-full max-w-md px-4 py-12">
        {children}
      </div>
    </div>
  );
}
