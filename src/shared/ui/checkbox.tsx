"use client"

import { InputHTMLAttributes, ReactNode, useId, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "../utils"

// --- TYPES ---

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id">

interface CheckboxProps extends NativeInputProps {
    label: ReactNode
}

interface CheckboxGroupProps<T extends string> {
    defaultValue?: T[]
    onChange?: (values: T[]) => void
    options: Array<CheckboxProps & { value: T }>
    className?: string
}

interface CheckboxGroupSkeletonProps {
    count?: number
    className?: string
}

// --- COMPONENTS: CHECKBOX ---

export const Checkbox = ({ label, className, ...rest }: CheckboxProps) => {
    const id = useId()

    return (
        <label
            htmlFor={id}
            className={cn(
                "inline-flex items-center gap-2 cursor-pointer select-none",
                "has-disabled:cursor-not-allowed has-disabled:opacity-50",
                className,
            )}
        >
            <span className="relative size-6 shrink-0 rounded-lg overflow-hidden">
                <input
                    type="checkbox"
                    id={id}
                    className="peer sr-only"
                    {...rest}
                />

                <span
                    className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        "bg-[#F1F1F1]",
                        "transition-all duration-200",
                        "peer-checked:bg-[#FE5F00]",
                        "peer-checked:[&_svg]:opacity-100",
                        "peer-checked:[&_svg]:scale-100",
                    )}
                >
                    <Check
                        size={16}
                        strokeWidth={3}
                        className="scale-90 opacity-0 text-white transition-all duration-200"
                    />
                </span>
            </span>

            <span className="text-base">{label}</span>
        </label>
    )
}

// --- COMPONENTS: CHECKBOX GROUP ---

export const CheckboxGroup = <T extends string>({
                                                    defaultValue = [],
                                                    onChange,
                                                    options,
                                                    className,
                                                }: CheckboxGroupProps<T>) => {

    // --- HOOKS: STATE ---

    const [selectedValues, setSelectedValues] = useState<T[]>(defaultValue)

    // --- HANDLERS ---

    const toggle = (value: T) => {
        const nextValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]

        setSelectedValues(nextValues)

        if (onChange) {
            onChange(nextValues)
        }
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {options.map((option) => (
                <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={selectedValues.includes(option.value)}
                    disabled={option.disabled}
                    onChange={() => toggle(option.value)}
                />
            ))}
        </div>
    )
}

// --- COMPONENTS: SKELETON ---

export const CheckboxGroupSkeleton = ({
                                          count = 3,
                                          className,
                                      }: CheckboxGroupSkeletonProps) => {
    return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="inline-flex items-center gap-4 select-none"
                >
                    <span className="size-6 shrink-0 rounded-lg bg-gray-200 animate-pulse" />
                    <span className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
                </div>
            ))}
        </div>
    )
}