import { LoginForm } from "@/components/ui/auth/LoginForm";
import React, { Suspense } from "react";

export default function page() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div
       className="relative mx-auto flex w-full max-w-[420px] flex-col space-y-2.5 p-12 mt-32 md:-mt-32
       rounded-lg bg-card border border-[#f3f3f3] shadow-2xs"
      >
        <div className="flex h-20 w-full justify-center items-center rounded-lg p-3 md:h-36">
          <div className="w-32 font-extrabold text-5xl md:w-36">Notsy.</div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
