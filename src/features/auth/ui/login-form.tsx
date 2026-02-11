'use client'

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailIcon, LockIcon } from "lucide-react";

import { Button, Input } from "@/shared/ui";
import { login } from "@/features/auth/api/login-action";
import { LoginFormProps } from "@/features/auth/model/types";

export const LoginForm = () => {
    const router = useRouter();

    const methods = useForm<LoginFormProps>({
        mode: "onBlur",
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const { handleSubmit, setError, formState: { isSubmitting, errors } } = methods;

    const onSubmit: SubmitHandler<LoginFormProps> = async (values) => {
        try {
            const { data, error } = await login(values);

            if (error) {
                setError("root", {
                    type: "server",
                    message: "Datele de autentificare sunt incorecte."
                });
                return;
            }

            if (data?.user) {
                router.push("/");
            }
        } catch (err) {
            setError("root", { message: "Eroare de conexiune la server." });
        }
    };

    return (
        <FormProvider {...methods}>
            <header className="mb-8 text-center sm:text-left">
                <h3 className="font-bold text-3xl tracking-tight text-gray-900">Autentificare</h3>
                <p className="font-regular text-base text-gray-500 mt-2">
                    Introdu adresa de email și parola pentru a intra în cont
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* --- EMAIL --- */}
                <Input name="email">
                    <Input.Label>Adresă de email</Input.Label>
                    <Input.Control variant="primary">
                        <Input.Slot><MailIcon size={18} /></Input.Slot>
                        <Input.Field
                            type="email"
                            placeholder="nume@exemplu.com"
                            rules={{
                                required: "Adresa de email este obligatorie",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Formatul email-ului nu este valid"
                                }
                            }}
                        />
                    </Input.Control>
                    <Input.Helper />
                </Input>

                {/* --- PAROLĂ --- */}
                <Input name="password">
                    <Input.Label>Parolă</Input.Label>
                    <Input.Control variant="primary">
                        <Input.Slot><LockIcon size={18} /></Input.Slot>
                        <Input.Field
                            type="password"
                            placeholder="••••••••"
                            rules={{
                                required: "Parola este obligatorie",
                                minLength: { value: 6, message: "Parola trebuie să conțină minim 6 caractere" }
                            }}
                        />
                    </Input.Control>
                    <Input.Helper />
                </Input>

                {/* --- EROARE ROOT (Server) --- */}
                {errors.root && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                        {errors.root.message}
                    </div>
                )}

                <Button
                    isLoading={isSubmitting}
                    type="submit"
                    className="w-full h-12 text-base font-semibold transition-all"
                >
                    Intră în cont
                </Button>

                <div className="text-center pt-4 border-t border-gray-50 mt-2">
                    <p className="text-sm text-gray-600">
                        Nu ai un cont încă?{" "}
                        <Link href="/register" className="text-[#FE5F00] hover:underline font-semibold tracking-tight">
                            Creează cont nou
                        </Link>
                    </p>
                </div>
            </form>
        </FormProvider>
    );
};