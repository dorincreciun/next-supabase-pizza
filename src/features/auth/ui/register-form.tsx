'use client'

import { Button, Input } from "@/shared/ui";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { registerUser } from "@/features/auth/api/register-action";
import { RegisterFormProps } from "@/features/auth/model/types";
import { MailIcon, LockIcon } from "lucide-react";

export const RegisterForm = () => {
    const router = useRouter();

    const methods = useForm<RegisterFormProps>({
        mode: "onBlur",
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const { handleSubmit, setError, formState: { isSubmitting, errors } } = methods;

    const onSubmit: SubmitHandler<RegisterFormProps> = async (values) => {
        try {
            const { data, error } = await registerUser(values);

            if (error) {
                setError("root", { type: "server", message: error.message || "Eroare server." });
                return;
            }

            if (!data?.user) {
                setError("email", { type: "manual", message: "Acest email este deja utilizat." });
                return;
            }

            router.back();
        } catch (err) {
            setError("root", { message: "Eroare de conexiune la server." });
        }
    };

    return (
        <FormProvider {...methods}>
            <header className="mb-8 text-center sm:text-left">
                <h1 className="font-bold text-3xl text-gray-900 tracking-tight">Creare cont</h1>
                <p className="mt-2 text-gray-500">Introdu datele necesare pentru a începe.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input name="email">
                    <Input.Label>Email</Input.Label>
                    <Input.Control variant="primary">
                        <Input.Slot><MailIcon size={18} /></Input.Slot>
                        <Input.Field
                            type="email"
                            placeholder="exemplu@mail.com"
                            rules={{
                                required: "Email-ul este obligatoriu",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Adresa de email nu este validă"
                                }
                            }}
                        />
                    </Input.Control>
                    <Input.Helper />
                </Input>

                <Input name="password">
                    <Input.Label>Parolă</Input.Label>
                    <Input.Control variant="primary">
                        <Input.Slot><LockIcon size={18} /></Input.Slot>
                        <Input.Field
                            type="password"
                            placeholder="••••••••"
                            rules={{
                                required: "Parola este obligatorie",
                                minLength: { value: 6, message: "Minim 6 caractere" }
                            }}
                        />
                    </Input.Control>
                    <Input.Helper />
                </Input>

                {errors.root && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                        {errors.root.message}
                    </div>
                )}

                <Button
                    isLoading={isSubmitting}
                    className="w-full h-12 text-base font-semibold transition-all shadow-sm"
                    type="submit"
                >
                    Înregistrare
                </Button>

                <div className="text-center pt-4 border-t border-gray-50 mt-2">
                    <p className="text-sm text-gray-600">
                        Ai deja un cont?{" "}
                        <Link href="/login" className="text-[#FE5F00] hover:underline font-semibold">
                            Loghează-te
                        </Link>
                    </p>
                </div>
            </form>
        </FormProvider>
    );
}