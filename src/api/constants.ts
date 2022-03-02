export const apiUrl = import.meta.env.VITE_SUPABASE_URL as string;
export const apiKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (apiUrl === undefined) {
  throw new Error("API URL not defined");
}
if (apiKey === undefined) {
  throw new Error("API key not defined");
}
