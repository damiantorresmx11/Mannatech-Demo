"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CHATWOOT_TOKEN = "aSP9XwKuFnwDo3WotMLwXfTo";
const CHATWOOT_URL = "https://chat.mannatech.dmlabs.mx";

// Routes where chat should be hidden
const HIDDEN_ROUTES = ["/admin", "/preview", "/socio"];

declare global {
  interface Window {
    chatwootSettings?: Record<string, any>;
    chatwootSDK?: { run: (config: Record<string, any>) => void };
    $chatwoot?: { toggle: (state: string) => void; toggleBubbleVisibility: (state: string) => void };
  }
}

export function ChatWidget() {
  const pathname = usePathname();
  const isHidden = HIDDEN_ROUTES.some((r) => pathname?.startsWith(r));

  useEffect(() => {
    if (isHidden) {
      // Hide Chatwoot on admin/preview routes
      window.$chatwoot?.toggleBubbleVisibility("hide");
      return;
    }

    // Show if already loaded
    if (window.$chatwoot) {
      window.$chatwoot.toggleBubbleVisibility("show");
      return;
    }

    // Load Chatwoot SDK
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "es",
      type: "standard",
      launcherTitle: "Chatea con nosotros",
    };

    const script = document.createElement("script");
    script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: CHATWOOT_TOKEN,
        baseUrl: CHATWOOT_URL,
      });
    };
    document.head.appendChild(script);
  }, [isHidden]);

  return null;
}
