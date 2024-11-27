import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./Layout";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppBar from "./components/AppBar.jsx";
import StickyMenuBar from "./components/StickyMenuBar.jsx";
import { SocketProvider } from "./providers/Socket.jsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <div className="pb-[60px]">
            <AppBar />
          </div>
          <StickyMenuBar />
          <div className="sm:pl-16 w-full min-h-screen">
            <Layout />
          </div>
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);
