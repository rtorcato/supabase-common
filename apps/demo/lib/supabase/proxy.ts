import { updateSession as updateSessionBase } from "@rtorcato/supabase-next";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  // If the env vars are not set, skip the auth check. You can remove this
  // once you set up the project.
  if (!hasEnvVars) {
    return NextResponse.next({ request });
  }

  // All the session-refresh + auth-redirect boilerplate now lives in
  // @rtorcato/supabase-next — we just pass the project's URL + key.
  return updateSessionBase(request, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  });
}
