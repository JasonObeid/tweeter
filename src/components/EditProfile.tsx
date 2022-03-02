import { useState, useEffect } from "react";
import { client } from "../api/supabaseClient";
import {
  Session,
  PostgrestSingleResponse,
  PostgrestError,
} from "@supabase/supabase-js";

export interface Profile {
  id: string;
  updated_at: string;
  username: string;
}
export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = client.auth.user();
      if (user === null) {
        throw Error("User was null");
      }

      const { data, error, status }: PostgrestSingleResponse<Profile> =
        await client
          .from("profiles")
          .select(`username`)
          .eq("id", user.id)
          .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      alert((error as PostgrestError).message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }: { username: string | null }) {
    try {
      setLoading(true);
      const user = client.auth.user();
      if (user === null) {
        throw Error("User was null");
      }

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await client.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (session.user === null) {
    throw Error("User was null");
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ username })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => client.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
