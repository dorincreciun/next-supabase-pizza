"use client"

import {InputElement} from "@/shared/ui/input";
import {Button} from "@/shared/ui";
import {useActionState, useEffect} from "react";
import {RegisterState} from "@/features/auth/api/register-action";
import {login} from "@/features/auth/api/login-action";
import Link from "next/link";
import {useRouter} from "next/navigation";

const initialState: RegisterState = {
    success: false,
    error: null,
};

export const LoginForm = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(login, initialState);

    useEffect(() => {
        if (state.success) {
            router.back()
        }
    }, [state, router]);

    return (
        <>
            <div>
                <h3 className={'font-semibold text-[30px]'}>Вход в аккаунт</h3>
                <p className={'font-regular text-base text-[#7C7C7C]'}>Введите номер телефона, чтобы войти или
                    зарегистрироваться</p>
            </div>
            <form action={formAction} className={'space-y-5'}>
                <InputElement variant="primary" inputSize="md">
                    <InputElement.Input type='email' placeholder="Email"/>
                </InputElement>
                <InputElement variant="primary" inputSize="md">
                    <InputElement.Input type='password' placeholder="Password"/>
                </InputElement>
                <Button isLoading={isPending} className={'w-full'}>
                    Вход
                </Button>
                <Link href={'/register'}>register</Link>
            </form>
        </>
    )
}