export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-screen w-full flex-col px-4 md:px-0 md:pt-0 ">
      <div className="pt-0 md:pt-20">{children}</div>
    </div>
  );
}
