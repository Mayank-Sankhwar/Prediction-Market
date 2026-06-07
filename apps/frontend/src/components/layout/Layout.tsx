import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { ToastContainer } from "../ui/ToastContainer";

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Trade outcome shares on binary prediction markets. Prices reflect crowd probability.</p>
      </footer>
      <ToastContainer />
    </div>
  );
}
