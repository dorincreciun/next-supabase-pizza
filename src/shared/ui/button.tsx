"use client"

import * as React from "react"
import { ButtonHTMLAttributes } from "react"
import { useFormStatus } from "react-dom"
import { cva, VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react"
import { cn } from "@/shared/utils"

// --- STYLES (CVA) ---

const buttonCva = cva(
    [
        "relative inline-flex items-center justify-center gap-2",
        "font-medium select-none outline-none",
        "rounded-xl cursor-pointer",
        "transition-all duration-150 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:transition-transform before:duration-700",
        "enabled:hover:before:translate-x-full",
        "data-[loading=true]:cursor-wait",
    ],
    {
        variants: {
            size: {
                sm: "h-10 px-2 text-sm",
                md: "h-12 px-3 text-base",
                lg: "h-14 px-4 text-lg",
            },
            color: {
                primary: "",
                secondary: "",
                tertiary: "",
            },
            kind: {
                solid: "",
                outline: "border bg-transparent",
                ghost: "bg-transparent",
                soft: "",
            },
            onlyIcon: {
                true: "aspect-square px-0",
            },
        },
        defaultVariants: {
            size: "md",
            color: "primary",
            kind: "solid",
        },
        compoundVariants: [
            {
                color: "primary",
                kind: "solid",
                className: [
                    "bg-[#FE5F00] text-white shadow-sm",
                    "enabled:hover:bg-[#F45A00] enabled:hover:shadow-md",
                    "active:bg-[#FE5F00] active:shadow-sm active:brightness-[0.96]",
                    "focus-visible:ring-[#FE5F00]/50",
                ],
            },
            {
                color: "primary",
                kind: "outline",
                className: [
                    "border-[#FE5F00] text-[#FE5F00]",
                    "enabled:hover:bg-[#FE5F00]/10",
                    "active:bg-[#FE5F00]/15",
                    "focus-visible:ring-[#FE5F00]/50",
                ],
            },
            {
                color: "primary",
                kind: "ghost",
                className: [
                    "text-[#FE5F00]",
                    "enabled:hover:bg-[#FE5F00]/10",
                    "active:bg-[#FE5F00]/15",
                    "focus-visible:ring-[#FE5F00]/50",
                ],
            },
            {
                color: "primary",
                kind: "soft",
                className: [
                    "bg-[#FE5F00]/10 text-[#FE5F00]",
                    "enabled:hover:bg-[#FE5F00]/18",
                    "active:bg-[#FE5F00]/22",
                    "focus-visible:ring-[#FE5F00]/50",
                ],
            },
            {
                color: "secondary",
                kind: "solid",
                className: [
                    "bg-[#FFFAF4] text-[#FE5F00] shadow-sm",
                    "enabled:hover:bg-[#FFF4E6]",
                    "active:bg-[#FFFAF4] active:brightness-[0.97]",
                    "focus-visible:ring-[#FE5F00]/30",
                ],
            },
            {
                color: "secondary",
                kind: "outline",
                className: [
                    "border-[#EDEDED] text-[#888888]",
                    "enabled:hover:border-[#FE5F00] enabled:hover:text-[#FE5F00]",
                    "active:bg-black/5",
                    "focus-visible:ring-gray-300",
                ],
            },
            {
                color: "secondary",
                kind: "ghost",
                className: [
                    "text-[#888888]",
                    "enabled:hover:text-[#FE5F00] enabled:hover:bg-gray-50",
                    "active:bg-gray-100",
                    "focus-visible:ring-gray-300",
                ],
            },
            {
                color: "secondary",
                kind: "soft",
                className: [
                    "bg-gray-100 text-gray-700",
                    "enabled:hover:bg-gray-200",
                    "active:bg-gray-200 active:brightness-[0.97]",
                    "focus-visible:ring-gray-300",
                ],
            },
            {
                color: "tertiary",
                kind: "solid",
                className: [
                    "bg-gray-900 text-white shadow-sm",
                    "enabled:hover:bg-gray-800 enabled:hover:shadow-md",
                    "active:bg-gray-900 active:brightness-[0.96]",
                    "focus-visible:ring-gray-400",
                ],
            },
            {
                color: "tertiary",
                kind: "outline",
                className: [
                    "border-gray-900 text-gray-900",
                    "enabled:hover:bg-gray-50",
                    "active:bg-gray-100",
                    "focus-visible:ring-gray-400",
                ],
            },
            {
                color: "tertiary",
                kind: "ghost",
                className: [
                    "text-gray-900",
                    "enabled:hover:bg-gray-100",
                    "active:bg-gray-200",
                    "focus-visible:ring-gray-400",
                ],
            },
            {
                color: "tertiary",
                kind: "soft",
                className: [
                    "bg-gray-900/10 text-gray-900",
                    "enabled:hover:bg-gray-900/18",
                    "active:bg-gray-900/22",
                    "focus-visible:ring-gray-400",
                ],
            },
        ],
    },
)

// --- TYPES ---

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">

interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonCva> {
    isLoading?: boolean
}

// --- COMPONENT ---

export const Button = ({
                           className,
                           isLoading,
                           disabled,
                           size,
                           color,
                           kind,
                           children,
                           onlyIcon,
                           ...rest
                       }: ButtonProps) => {
    const { pending } = useFormStatus()

    const activeLoading = Boolean(isLoading || pending)
    const buttonDisabled = Boolean(activeLoading || disabled)

    return (
        <button
            disabled={buttonDisabled}
            className={cn(buttonCva({ size, color, kind, onlyIcon }), className)}
            data-loading={activeLoading ? "true" : "false"}
            {...rest}
        >
            <span
                className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "transition-opacity duration-150",
                    activeLoading && "opacity-0",
                )}
            >
                {children}
            </span>

            {activeLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loader className="animate-spin" size={16} />
                </span>
            )}
        </button>
    )
}