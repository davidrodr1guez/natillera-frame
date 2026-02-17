"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function FarcasterInit() {
  useEffect(() => {
    // Dismiss the Farcaster splash screen
    sdk.actions.ready();
  }, []);

  return null;
}
