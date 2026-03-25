"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string | null;
  email: string;
};

export const initialLoginActionState: LoginActionState = {
  error: null,
  email: "",
};

export async function signInAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Enter both your staff email and password.",
      email,
    };
  }

  const supabase = await createClient();

  if (!supabase) {
    return {
      error: "Supabase is not connected yet. Add the environment variables first.",
      email,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: "The email or password is incorrect. Please try again.",
      email,
    };
  }

  redirect("/dashboard");
}
