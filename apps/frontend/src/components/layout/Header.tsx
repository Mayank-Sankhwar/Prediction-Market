import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useBalance } from "../../hooks/useTrading";
import { formatCents, truncateAddress } from "../../lib/format";
import { Button } from "../ui/Button";

export function Header() {
  const {
    isAuthenticated,
    loading,
    walletAddress,
    signInWithPhantom,
    signInWithSolflare,
    signOut,
  } = useAuth();
  const balanceQuery = useBalance(isAuthenticated);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span>
            <strong>Predex</strong>
            <small>Prediction Markets</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Markets
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Portfolio
          </NavLink>
        </nav>

        <div className="header-actions">
          {isAuthenticated && balanceQuery.data !== undefined ? (
            <div className="balance-pill" title="Available USD balance">
              <span className="balance-label">Balance</span>
              <strong>{formatCents(balanceQuery.data)}</strong>
            </div>
          ) : null}

          {loading ? (
            <span className="auth-loading">Connecting…</span>
          ) : isAuthenticated ? (
            <div className="auth-cluster">
              {walletAddress ? (
                <span className="wallet-chip">{truncateAddress(walletAddress, 6)}</span>
              ) : null}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="auth-cluster">
              {window.solflare ? (
                <Button variant="secondary" size="sm" onClick={() => signInWithSolflare()}>
                  Solflare
                </Button>
              ) : null}
              <Button variant="primary" size="sm" onClick={() => signInWithPhantom()}>
                Phantom
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
