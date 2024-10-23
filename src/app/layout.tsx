"use client";

import * as React from "react";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppProvider,
  Navigation,
  Router,
  Session,
} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Box, Button, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { hooks, metaMask } from "@/walletUtils/connectors/metaMask";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Create a client
const queryClient = new QueryClient();
const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Navigation",
  },
  {
    segment: "token/lock",
    title: "Token lock",

    icon: <DashboardIcon />,
  },
  {
    segment: "token/liquidity",
    title: "Liquidity token",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "divider",
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
});

function LayoutPrivate(props: React.PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextRouter = useRouter();
  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams,
      navigate: (path) => nextRouter.push(String(path)),
    };
  }, [nextRouter, pathname, searchParams]);

  const [session, setSession] = React.useState<Session | null>(null);

  const isActive = hooks.useIsActive();
  const account = hooks.useAccount();

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        metaMask.activate();
      },
      signOut: async () => {
        if (metaMask?.deactivate) {
          metaMask.deactivate();
        } else {
          metaMask.resetState();
        }
        setSession(null);
      },
    };
  }, []);

  React.useEffect(() => {
    metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  React.useEffect(() => {
    if (!account) {
      setSession(null);
      return;
    }

    setSession({
      user: {
        name: account,
        image: "",
      },
    });
  }, [isActive, account]);
  const signer = hooks.useProvider()?.getSigner();

  return (
    <html>
      <body>
        <AppProvider
          session={session}
          authentication={authentication}
          router={router}
          branding={{
            logo: (
              <Box display="flex" alignItems="center" height={"100%"}>
                <AssessmentIcon />
              </Box>
            ),
            title: "Full Dev",
          }}
          navigation={NAVIGATION}
          theme={demoTheme}
        >
          <DashboardLayout
            slotProps={{
              toolbarAccount: {
                localeText: {
                  signInLabel: "Connect wallet",
                  signOutLabel: "Disconnect wallet",
                },
              },
            }}
          >
            <PageContainer>
              {!account || !signer ? (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  textAlign={"center"}
                  gap={4}
                >
                  <Typography variant="h1">Please connect wallet</Typography>
                  <Button
                    onClick={() => {
                      metaMask.activate();
                    }}
                  >
                    <Typography variant="h3">Connect</Typography>
                  </Button>
                </Box>
              ) : (
                props.children
              )}
            </PageContainer>
          </DashboardLayout>
        </AppProvider>
      </body>
    </html>
  );
}
export default function Layout(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LayoutPrivate {...props} />
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
