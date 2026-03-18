import { apiFetch } from "./APIClient";
import { supabase } from "../supabaseClient";

export interface UserProfile {
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface UpdateUserRequest {
  username: string;
  avatarUrl: string | null;
}

export const UserAPIService = {
  async getMe(): Promise<UserProfile> {
    const res = await apiFetch("/users/me");
    if (!res.ok) throw new Error("Errore nel caricamento del profilo.");
    const data = await res.json();
    return {
      username: data.username,
      email: data.email,
      avatarUrl: data.avatarUrl ?? null,
    };
  },

  async updateMe(request: UpdateUserRequest): Promise<void> {
    const res = await apiFetch("/users/me", {
      method: "PUT",
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Errore nel salvataggio del profilo.");
  },

  async updateAvatar(username: string, avatarUrl: string): Promise<void> {
    await UserAPIService.updateMe({ username, avatarUrl });
  },

  async updateUsername(username: string, avatarUrl: string | null): Promise<void> {
    await UserAPIService.updateMe({ username, avatarUrl });
  },

  async updatePassword(newPassword: string, confirmPassword: string): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("Le password non coincidono.");
    }
    if (newPassword.length < 6) {
      throw new Error("La password deve essere di almeno 6 caratteri.");
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error("Errore nell'aggiornamento della password.");
  },

  async syncCurrentUser(): Promise<void> {
    await apiFetch("/users/sync", { method: "POST" });
  },
};