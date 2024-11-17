import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppBar from "./components/AppBar.tsx";
import StickyMenuBar from "./components/StickyMenuBar.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="pb-[80px]">
          <AppBar />
        </div>
        <StickyMenuBar />
        <div className="sm:pl-16 w-full">
          <App />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);
