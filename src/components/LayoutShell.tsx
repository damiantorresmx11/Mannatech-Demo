"use client";

import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { NotificationProvider } from "@/components/Notification";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { ChatWidget } from "@/components/ChatWidget";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <LoadingScreen>
        <ScrollProgress />
        {children}
        <ScrollToTop />
        <NewsletterPopup />
        <ChatWidget />
      </LoadingScreen>
    </NotificationProvider>
  );
}
