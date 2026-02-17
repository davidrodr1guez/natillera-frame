"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function FarcasterInit() {
  useEffect(() => {
    // Wait for SDK context to be established, then dismiss splash screen
    const init = async () => {
      try {
        await sdk.context;
        sdk.actions.ready();
      } catch {
        // Not inside Farcaster — no-op
      }
    };
    init();
  }, []);

  return null;
}
