import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-white sm:py-2 flex flex-col justify-center">
      <div className="relative mx-auto flex h-full w-full max-w-[340px] flex-col overflow-hidden bg-white shadow-xl sm:h-[600px] sm:max-h-[calc(100vh-0.5rem)] sm:rounded-[40px] sm:border sm:border-neutral-300">
        {children}
      </div>
    </div>
  );
}