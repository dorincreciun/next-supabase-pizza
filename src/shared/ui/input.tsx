"use client"

import React, {
    createContext,
    useContext,
    useId,
    ReactNode,
    InputHTMLAttributes,
    LabelHTMLAttributes
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/shared/utils";

const inputVariants = cva(
    [
        "flex items-center w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "rounded-xl border outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]",
    ],
    {
        variants: {
            variant: {
                primary: "bg-[#FAFAFA] border-black/[0.06] focus-within:bg-white",
                secondary: "bg-white border-black/[0.08]",
            },
            inputSize: {
                sm: "h-10 px-3 text-sm gap-2",
                md: "h-12 px-4 text-base gap-3",
                lg: "h-14 px-5 text-lg gap-3",
            },
            status: {
                default: [
                    "focus-within:ring-1 focus-within:ring-[#FE5F00]/40",
                    "focus-within:border-[#FE5F00]/40 focus-within:shadow-[0_0_0_4px_rgba(254,95,0,0.04)]"
                ],
                error: [
                    "border-red-500/30 bg-red-50/20",
                    "focus-within:ring-1 focus-within:ring-red-500/40 focus-within:border-red-500/40",
                    "focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.06)]"
                ],
                success: [
                    "border-emerald-500/30 bg-emerald-50/20",
                    "focus-within:ring-1 focus-within:ring-emerald-500/40",
                    "focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.06)]"
                ],
                warning: [
                    "border-amber-500/40 bg-amber-50/20",
                    "focus-within:ring-1 focus-within:ring-amber-500/50",
                    "focus-within:shadow-[0_0_0_4px_rgba(245,158,11,0.06)]"
                ],
                loading: [
                    "border-blue-400/20 bg-blue-50/10 cursor-wait opacity-80",
                    "focus-within:border-blue-400/40"
                ],
                disabled: [
                    "bg-gray-100/80 border-gray-200/50 opacity-60 shadow-none !cursor-not-allowed select-none"
                ]
            }
        },
        defaultVariants: {
            variant: "primary",
            inputSize: "md",
            status: "default",
        },
    }
);

// ==========================================
// 🔵 TIPURI & CONTEXT
// ==========================================

/** Statusul vizual al componentei */
export type InputStatus = "default" | "error" | "success" | "warning" | "loading" | "disabled";

/** Props pentru contextul intern al grupului Input */
interface ContextProps {
    id: string;
    status: InputStatus;
    name?: string;
}

/** Props pentru componenta Root */
interface RootProps {
    /** ID unic manual. Dacă lipsește, se generează unul automat via useId */
    id?: string;
    /** Status manual. Dacă este folosit cu React Hook Form, statusul este calculat automat (error/loading) */
    status?: InputStatus;
    /** Numele câmpului pentru înregistrarea în React Hook Form */
    name?: string;
    children: ReactNode;
    className?: string;
}

const InputContext = createContext<ContextProps | null>(null);

/** Hook intern pentru accesarea stării comune a input-ului */
const useInputContext = () => {
    const ctx = useContext(InputContext);
    if (!ctx) throw new Error('Sub-componentele Input.* trebuie folosite în <Input /> (Root)');
    return ctx;
};

/**
 * @component Root
 * Componenta părinte care gestionează contextul și sincronizarea cu React Hook Form.
 */
const Root = ({ id: externalId, status: manualStatus, name, children, className }: RootProps) => {
    const generatedId = useId();
    const id = externalId || generatedId;

    const ctx = useFormContext();
    const rhfError = name && ctx?.formState.errors[name];
    const isSubmitting = ctx?.formState.isSubmitting;
    const isValidating = ctx?.formState.isValidating;

    let computedStatus: InputStatus = manualStatus || "default";

    // Sincronizare automată cu starea formularului
    if (isSubmitting || isValidating) computedStatus = "loading";
    else if (rhfError) computedStatus = "error";

    return (
        <InputContext.Provider value={{ id, status: computedStatus, name }}>
            <div className={cn("flex flex-col w-full group/field", className)}>
                {children}
            </div>
        </InputContext.Provider>
    );
};

/**
 * @component Label
 * Eticheta input-ului, legată automat prin `htmlFor` de câmpul de editare.
 */
const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => {
    const { id, status } = useInputContext();
    const labelStyles = {
        default: "text-gray-700",
        error: "text-red-600",
        success: "text-emerald-700",
        warning: "text-amber-700",
        loading: "text-blue-600",
        disabled: "text-gray-400 cursor-not-allowed"
    };
    return (
        <label
            htmlFor={id}
            className={cn(
                "text-sm font-medium mb-1.5 ml-1 block transition-colors duration-300",
                labelStyles[status],
                className
            )}
            {...props}
        />
    );
};

/**
 * @component Control
 * Containerul vizual care aplică stilurile de bordură, shadow și focus.
 */
const Control = ({ children, variant, inputSize, className }: {
    children: ReactNode,
    className?: string
} & VariantProps<typeof inputVariants>) => {
    const { status } = useInputContext();
    return (
        <div className={cn(inputVariants({ variant, inputSize, status }), className)}>
            {children}
        </div>
    );
};

/**
 * @component Slot
 * Element decorativ (iconiță) plasat în interiorul Control-ului.
 */
const Slot = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={cn("flex items-center justify-center shrink-0 text-gray-400 select-none px-2", className)}>
        {children}
    </div>
);

/** Props pentru componenta Field (Input nativ) */
interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'disabled'> {
    /** Reguli de validare React Hook Form (required, pattern, validate, etc.) */
    rules?: RegisterOptions;
}

/**
 * @component Field
 * Câmpul de input nativ. Gestionează automat register-ul RHF și starea de disabled.
 */
const Field = ({ className, rules, ...props }: FieldProps) => {
    const { id, status, name } = useInputContext();
    const ctx = useFormContext();
    const isDisabled = status === "disabled" || status === "loading";

    // Înregistrare automată în RHF dacă name și contextul există
    const registration = (ctx && name) ? ctx.register(name, rules) : {};

    return (
        <input
            {...props}
            {...registration}
            id={id}
            disabled={isDisabled}
            className={cn(
                "w-full h-full bg-transparent outline-none border-none focus:ring-0 px-0",
                "placeholder:text-gray-300 text-gray-700 font-light tracking-tight",
                isDisabled && "pointer-events-none cursor-not-allowed",
                className
            )}
        />
    );
};

/**
 * @component Helper
 * Text de suport sau eroare. Afișează automat mesajul din React Hook Form dacă există.
 */
const Helper = ({ children, className }: { children?: ReactNode, className?: string }) => {
    const { id, status, name } = useInputContext();
    const ctx = useFormContext();

    const rhfError = (ctx && name) ? ctx.formState.errors[name] : null;
    const message = rhfError?.message?.toString() || children;

    if (!message) return null;

    const helperStyles = {
        default: "text-gray-400",
        error: "text-red-500 font-medium",
        success: "text-emerald-600 font-medium",
        warning: "text-amber-600 font-medium",
        loading: "text-blue-500",
        disabled: "text-gray-300"
    };

    return (
        <p
            id={`${id}-helper`}
            role={status === "error" ? "alert" : "status"}
            className={cn(
                "text-[11px] mt-1.5 ml-1 transition-all duration-300 animate-in fade-in slide-in-from-top-1",
                helperStyles[status],
                className
            )}
        >
            {message}
        </p>
    );
};

/**
 * @example
 * <Input name="email">
 *     <Input.Label>Email</Input.Label>
 *     <Input.Control>
 *         <Input.Field placeholder="ion@yahoo.com" rules={{ required: "Email obligatoriu" }} />
 *      </Input.Control>
 *      <Input.Helper />
 * </Input>
 */
export const Input = Object.assign(Root, {
    Label,
    Control,
    Slot,
    Field,
    Helper,
});