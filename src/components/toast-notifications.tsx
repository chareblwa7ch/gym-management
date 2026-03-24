"use client";

import { Toaster } from "sonner";

export function ToastNotifications() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-3xl border !bg-card !text-card-foreground",
        },
      }}
    />
  );
}
