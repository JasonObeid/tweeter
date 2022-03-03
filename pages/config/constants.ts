export const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const apiKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

if (apiUrl === undefined) {
  throw new Error("API URL not defined");
}
if (apiKey === undefined) {
  throw new Error("API key not defined");
}
