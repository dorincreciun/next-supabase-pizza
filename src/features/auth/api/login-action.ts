'use server'

import {createClient} from "@/shared/lib/supabase/server";
import {RegisterState} from "@/features/auth/api/register-action";

export interface LoginState {
    success: boolean;
    error: string | null;
}

export async function login(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    try {
        const supabase = await createClient()

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        }

        const {error} = await supabase.auth.signInWithPassword(data)
        if (error) {
            return {success: false, error: error.message};
        }

        return {success: true, error: null};
    } catch (e) {
        return {success: false, error: "A apărut o eroare neașteptată."};
    }
}