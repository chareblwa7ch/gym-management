import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastNotifications } from "@/components/toast-notifications";
import { GYM_NAME } from "@/lib/constants";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: GYM_NAME,
    template: `%s | ${GYM_NAME}`,
  },
  description: "Private membership management dashboard for ElAmidy Sports Fitness.",
  applicationName: GYM_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastNotifications />
        </ThemeProvider>
      </body>
    </html>
  );
}
