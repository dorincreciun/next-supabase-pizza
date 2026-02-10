'use client'

import {Button, InputElement} from "@/shared/ui";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect} from "react";
import {registerUser} from "@/features/auth/api/register-action";
import {RegisterFormProps} from "@/features/auth/model/types";


export const RegisterForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: {
            isSubmitting,
            isSubmitSuccessful,
            errors,
        }
    } = useForm<RegisterFormProps>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            email: '',
            password: '',
        }
    })

    useEffect(() => {
        if (isSubmitSuccessful) {
            router.back()
        }
    }, [isSubmitSuccessful, router]);


    const onSubmit: SubmitHandler<RegisterFormProps> = async (props) => {
        const {data, error} = await registerUser(props)

        if(error) {
            setError("root",{
                type: "server",
                message: error.message
            })
            return
        } else if(!data.user) {
            setError("root",{
                type: "server",
                message: "Email-ul dat a fost deja inregistrat!"
            })
        }
    }

    return (
        <>
            <div>
                <h3 className={'font-semibold text-[30px]'}>Вход в аккаунт</h3>
                <p className={'font-regular text-base text-[#7C7C7C]'}>
                    Введите номер телефона, чтобы войти или зарегистрироваться
                </p>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={'space-y-5'}
            >
                {errors.root?.message}
                <InputElement
                    variant="primary"
                    inputSize="md"
                >
                    <InputElement.Input
                        type="email"
                        placeholder={'Email'}
                        {...register('email', {required: true})}
                    />
                </InputElement>
                <InputElement
                    variant="primary"
                    inputSize="md"
                >
                    <InputElement.Input
                        type="password"
                        placeholder={'Password'}
                        {...register('password', {required: true})}
                    />
                </InputElement>
                <Button
                    isLoading={isSubmitting}
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