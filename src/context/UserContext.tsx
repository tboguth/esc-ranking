import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { DbUser } from "../types/database";
import type { CategoryRatings } from "../types";

interface UserContextType {
  userId: string | null;
  username: string | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const USER_KEY = "esc-user";
const RATINGS_KEY = "esc-ratings";

function readStoredUser(): { id: string; username: string } | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function loadRatingsFromSupabase(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("user_id", userId);

    if (error || !data) return;

    const map: Record<string, CategoryRatings> = {};
    for (const r of data) {
      if (
        r.musik != null &&
        r.performance != null &&
        r.kostuem != null &&
        r.show != null &&
        r.wow_faktor != null &&
        r.esc_feeling != null
      ) {
        map[r.country_code as string] = {
          musik: r.musik as number,
          performance: r.performance as number,
          kostuem: r.kostuem as number,
          show: r.show as number,
          wowFaktor: r.wow_faktor as number,
          escFeeling: r.esc_feeling as number,
        };
      }
    }
    localStorage.setItem(RATINGS_KEY, JSON.stringify(map));
  } catch {
    // silent fail — localStorage cache bleibt unverändert
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const stored = readStoredUser();
  const [userId, setUserId] = useState<string | null>(stored?.id ?? null);
  const [username, setUsername] = useState<string | null>(stored?.username ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (name: string) => {
    setIsLoading(true);
    try {
      // Vorhandenen User suchen
      const { data: existing, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("username", name)
        .limit(1);

      if (selectError) throw selectError;

      let user: DbUser;

      if (existing && existing.length > 0) {
        user = existing[0] as DbUser;
        await loadRatingsFromSupabase(user.id);
      } else {
        // Neuen User anlegen
        const { data: created, error: insertError } = await supabase
          .from("users")
          .insert({ username: name })
          .select()
          .single();

        if (insertError) throw insertError;
        user = created as DbUser;
      }

      setUserId(user.id);
      setUsername(user.username);
      localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, username: user.username }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setUsername(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(RATINGS_KEY);
  }, []);

  return (
    <UserContext.Provider value={{ userId, username, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser muss innerhalb von UserProvider verwendet werden");
  return ctx;
}
