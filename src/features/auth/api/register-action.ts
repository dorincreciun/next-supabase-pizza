'use server'

import {createClient} from "@/shared/lib/supabase/server";
import {redirect} from "next/navigation";

export interface RegisterState {
    success: boolean;
    error: string | null;
}

export async function register(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    try {
        const supabase = await createClient();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const {error} = await supabase.auth.signUp({email, password});

        if (error) {
            return {success: false, error: error.message};
        }

        return {success: true, error: null};
    } catch (e) {
        return {success: false, error: "A apărut o eroare neașteptată."};
    }
}