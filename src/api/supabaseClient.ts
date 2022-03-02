import { createClient } from "@supabase/supabase-js";
import { apiKey, apiUrl } from "./constants";

export const client = createClient(apiUrl, apiKey);
