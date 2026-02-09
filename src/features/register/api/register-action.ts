'use server'

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {createClient} from "@/shared/lib/supabase/server";

export async function register(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const {error} = await supabase.auth.signUp(data)

    if (error) {
        console.dir(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/account')
}