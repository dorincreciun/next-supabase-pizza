'use server'

import {createClient} from "@/shared/lib/supabase/server";
import {RegisterFormProps} from "@/features/auth/model/types";
import {AuthResponse} from "@supabase/auth-js";


export async function registerUser({email, password}: RegisterFormProps): Promise<AuthResponse> {
    const supabase = await createClient();

    return supabase.auth.signUp({
        email,
        password,
    });
}