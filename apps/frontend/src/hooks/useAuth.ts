import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AuthClaims } from "../types";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [claims, setClaims] = useState<AuthClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);
      if (data.session) {
        const claimsResult = await supabase.auth.getClaims();
        setClaims((claimsResult.data?.claims ?? null) as AuthClaims | null);
      } else {
        setClaims(null);
      }
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        const claimsResult = await supabase.auth.getClaims();
        setClaims((claimsResult.data?.claims ?? null) as AuthClaims | null);
      } else {
        setClaims(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithSolflare = async () => {
    if (!window.solflare) {
      throw new Error("Solflare wallet is not installed");
    }
    await supabase.auth.signInWithWeb3({
      chain: "solana",
      statement: "I confirm I want to sign in to Prediction Market",
      wallet: window.solflare as never,
    });
  };

  const signInWithPhantom = async () => {
    await supabase.auth.signInWithWeb3({
      chain: "solana",
      statement: "I confirm I want to sign in to Prediction Market",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const walletAddress =
    (claims?.address as string | undefined) ??
    (session?.user?.user_metadata?.custom_claims?.address as string | undefined);

  return {
    session,
    claims,
    loading,
    isAuthenticated: Boolean(session),
    walletAddress,
    signInWithSolflare,
    signInWithPhantom,
    signOut,
  };
}
