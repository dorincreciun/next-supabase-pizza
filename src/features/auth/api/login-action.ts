'use server'

import { createClient } from "@/shared/lib/supabase/server";
import { LoginFormProps } from "@/features/auth/model/types";
import { AuthResponse,  } from "@supabase/auth-js";

export async function login({ email, password }: LoginFormProps): Promise<AuthResponse> {
    const supabase = await createClient();

    return supabase.auth.signInWithPassword({
        email,
        password,
    });
}