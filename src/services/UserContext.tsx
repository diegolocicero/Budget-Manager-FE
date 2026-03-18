import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserAPIService, type UserProfile } from "../services/UserAPIService";

interface UserContextType {
  profile: UserProfile;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({ username: "", email: "", avatarUrl: null });

  const refreshProfile = async () => {
    try {
      const data = await UserAPIService.getMe();
      setProfile(data);
    } catch {}
  };

  useEffect(() => { refreshProfile(); }, []);

  return (
    <UserContext.Provider value={{ profile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}