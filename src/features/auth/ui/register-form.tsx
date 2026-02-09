'use client'

import {Button, InputElement} from "@/shared/ui";
import {useActionState, useEffect} from "react";
import {register, RegisterState} from "../api/register-action";
import {useRouter} from "next/navigation";
import Link from "next/link";

const initialState: RegisterState = {
    success: false,
    error: null,
};

export const RegisterForm = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(register, initialState);

    useEffect(() => {
        router.back()
        if (state.success) {
            router.back()
        }
    }, [state, router]);

    return (
        <>
            <div>
                <h3 className={'font-semibold text-[30px]'}>Вход в аккаунт</h3>
                <p className={'font-regular text-base text-[#7C7C7C]'}>
                    Введите номер телефона, чтобы войти или зарегистрироваться
                </p>
            </div>
            <form
                action={formAction}
                className={'space-y-5'}
            >
                <InputElement
                    variant="primary"
                    inputSize="md"
                >
                    <InputElement.Input
                        type="email"
                        name={'email'}
                        placeholder="Email"
                    />
                </InputElement>
                <InputElement
                    variant="primary"
                    inputSize="md"
                >
                    <InputElement.Input
                        type="password"
                        name={'password'}
                        placeholder="Password"
                    />
                </InputElement>
                <Button
                    isLoading={isPending}
                    className={'w-full'}
                    type={'submit'}
                >
                    Зарегестрироватся
                </Button>
                <Link href={'/login'}>log in</Link>
            </form>
        </>
    )
}