import { useAuth } from "./useAuth";

/** @deprecated Use useAuth instead */
export function useUser() {
  const { claims } = useAuth();
  return { claims };
}
