import { BookLogo } from "@/assets";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col px-4 md:px-0 md:pt-0">
      <div className="pointer-events-none flex items-center justify-center pb-10 pt-4 md:absolute md:right-8 md:top-8 md:pb-0 md:pt-0">
        <BookLogo height="100" />
      </div>

      <div className="container mx-auto flex-1 pt-0 md:pt-20">{children}</div>
    </div>
  );
}
