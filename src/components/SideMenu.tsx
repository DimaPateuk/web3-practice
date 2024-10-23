"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Link } from "@mui/material";
import NextLink from "next/link";

export default function SideMenu() {
  return (
    <Drawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Link component={NextLink} href={"/token/lock"}>
          Token lock
        </Link>

        <Link component={NextLink} href={"/token/liquidity"}>
          Liquidity Token
        </Link>
      </Box>
    </Drawer>
  );
}
