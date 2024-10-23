"use client";

import {
  ERC20TokenWidget,
  ERC20TokenWidgetProvider,
} from "@/features/ERC20TokenWidget";
import { TokenLockerWidget } from "@/features/TokenLockerWidget";
import { Stack } from "@mui/material";
import React from "react";

export default function Lock() {
  return (
    <React.Suspense fallback="loading">
      <ERC20TokenWidgetProvider tokenAddr="0xfff9976782d46cc05630d1f6ebab18b2324d6b14">
        <Stack spacing={3}>
          <ERC20TokenWidget />
          <TokenLockerWidget />
        </Stack>
      </ERC20TokenWidgetProvider>
    </React.Suspense>
  );
}
