import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden bg-neutral-200 sm:py-4">
      <div className="relative mx-auto flex h-full w-full max-w-[390px] flex-col overflow-hidden bg-white shadow-xl sm:h-[920px] sm:max-h-[calc(100vh-2rem)] sm:rounded-[44px] sm:border sm:border-neutral-300">
        {children}
      </div>
    </div>
  );
}