"use client"

import * as React from "react"
import { createContext, useContext, useMemo, useRef, forwardRef } from "react"
import { cn } from "@/shared/utils"
import { cva, type VariantProps } from "class-variance-authority"

/* --- Context --- */
type InputContextValue = {
    inputRef: React.RefObject<HTMLInputElement | null>
    focusInput: () => void
}

const InputContext = createContext<InputContextValue | null>(null)

const useInputContext = () => {
    const ctx = useContext(InputContext)
    if (!ctx) {
        throw new Error("Input sub-components must be used inside <InputElement />")
    }
    return ctx
}

/* --- Styles --- */
const inputContainerVariants = cva(
    [
        "flex items-center gap-2.5 overflow-hidden",
        "rounded-xl border",
        "transition-all duration-200 ease-in-out",
        "focus-within:ring-2 focus-within:ring-[#FE5F00]/30",
        "focus-within:ring-offset-2 focus-within:ring-offset-white",
        "focus-within:shadow-sm",
        "hover:border-[#E0E0E0]",
        "has-[:disabled]:opacity-50",
        "has-[:disabled]:cursor-not-allowed",
        "has-[:disabled]:bg-[#F5F5F5]/50",
        "data-[error=true]:border-red-400",
        "data-[error=true]:focus-within:border-red-500",
        "data-[error=true]:focus-within:ring-red-500/30",
    ],
    {
        variants: {
            variant: {
                primary: "bg-[#F9F9F9] border-[#F9F9F9]",
                secondary: "bg-white border-[#EDEDED] focus-within:border-[#FE5F00]",
            },
            inputSize: {
                sm: "h-10 px-3 text-sm gap-2",
                md: "h-12 px-4 text-base gap-2.5",
                lg: "h-14 px-5 text-lg gap-3",
            },
        },
        defaultVariants: {
            variant: "primary",
            inputSize: "md",
        },
    }
)

/* --- Components --- */

// 1. Root Provider
interface InputRootProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof inputContainerVariants> {
    error?: boolean
}

const InputRoot = ({
                       children,
                       className,
                       variant,
                       inputSize,
                       error,
                       ...props
                   }: InputRootProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const value = useMemo(() => ({
        inputRef,
        focusInput: () => inputRef.current?.focus(),
    }), [])

    return (
        <InputContext.Provider value={value}>
            <div
                className={cn(inputContainerVariants({ variant, inputSize }), className)}
                data-error={error}
                onClick={() => inputRef.current?.focus()}
                {...props}
            >
                {children}
            </div>
        </InputContext.Provider>
    )
}

// 2. Main Input field
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, forwardedRef) => {
        const { inputRef } = useInputContext()

        // Combinăm ref-ul din context cu cel primit prin props (pentru hook-form)
        const setRefs = (node: HTMLInputElement) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
            if (typeof forwardedRef === "function") {
                forwardedRef(node)
            } else if (forwardedRef) {
                forwardedRef.current = node
            }
        }

        return (
            <input
                ref={setRefs}
                className={cn(
                    "m-0 h-full w-full appearance-none border-0 bg-transparent p-0",
                    "outline-none focus:ring-0",
                    "text-inherit placeholder:text-[#888888]/60",
                    "placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-40",
                    className
                )}
                {...props}
            />
        )
    }
)
Input.displayName = "InputElement.Input"

// 3. Addon (Prefix/Suffix)
interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
    focusOnClick?: boolean
}

const InputAddon = ({
                        children,
                        className,
                        focusOnClick = true,
                        onClick,
                        ...props
                    }: InputAddonProps) => {
    const { focusInput } = useInputContext()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e)
        if (!e.defaultPrevented && focusOnClick) focusInput()
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "flex shrink-0 items-center text-[#888888] transition-colors duration-200 cursor-text",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

/* --- API Export --- */
export const InputElement = Object.assign(InputRoot, {
    Input,
    Addon: InputAddon,
})