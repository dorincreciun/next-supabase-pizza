"use client"
import { InputHTMLAttributes, ReactNode, useId } from "react"
import { cn } from "@/shared/utils"

/* Radio component */
type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id">

interface RadioProps extends NativeInputProps {
    label: ReactNode
}

const Radio = ({ label, className, ...rest }: RadioProps) => {
    const id = useId()

    return (
        <label
            htmlFor={id}
            className={cn(
                "inline-flex items-center gap-2 select-none cursor-pointer",
                "group",
                "has-disabled:cursor-not-allowed has-disabled:opacity-50",
                className,
            )}
        >
            <span className="relative overflow-hidden rounded-lg size-6 shrink-0">
                <input
                    type="radio"
                    id={id}
                    className="peer sr-only"
                    {...rest}
                />

                {/* Radio circle background */}
                <span
                    className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        "bg-[#F1F1F1] rounded-full border-2 border-transparent",
                        "transition-all duration-200 ease-out",

                        // Checked
                        "peer-checked:bg-white peer-checked:border-[#FE5F00]",

                        // Focus
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-[#FE5F00]/50 peer-focus-visible:ring-offset-1",

                        // Hover
                        "group-hover:bg-[#E8E8E8]",
                        "peer-checked:group-hover:border-[#E55500]",

                        // Disabled
                        "peer-disabled:group-hover:bg-[#F1F1F1]",
                    )}
                >
                    <span
                        className={cn(
                            "size-2.5 rounded-full bg-[#FE5F00]",
                            "transition-all duration-200 ease-out",
                            "scale-0 opacity-0",
                            "peer-checked:scale-100 peer-checked:opacity-100",
                            "peer-checked:animate-radio-pop",
                        )}
                    />
                </span>
            </span>

            {/* text */}
            <span className={"text-base"}>{label}</span>
        </label>
    )
}

/* RadioGroup component */
interface RadioGroupProps<T extends string> {
    defaultValue: T
    onValueChange?: (value: T) => void
    options: Array<RadioProps & { value: T }>
    className?: string
    name: string
}

export const RadioGroup = <T extends string>({
                                                 defaultValue,
                                                 onValueChange,
                                                 options,
                                                 className,
                                                 name,
                                             }: RadioGroupProps<T>) => {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {options.map((option) => {
                const { value: optionValue, ...radioProps } = option

                return (
                    <Radio
                        key={optionValue}
                        name={name}
                        checked={defaultValue === optionValue}
                        onChange={() => onValueChange?.(optionValue)}
                        {...radioProps}
                    />
                )
            })}
        </div>
    )
}

/* RadioSkeleton */
interface RadioSkeletonProps {
    className?: string
}

const RadioSkeleton = ({ className }: RadioSkeletonProps) => {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 select-none",
                className,
            )}
        >
            {/* circle */}
            <span
                className={cn(
                    "relative size-6 shrink-0 rounded-full",
                    "bg-gray-200",
                    "animate-pulse",
                )}
            />

            {/* label */}
            <span
                className={cn(
                    "h-4 w-full rounded-md",
                    "bg-gray-200",
                    "animate-pulse",
                )}
            />
        </div>
    )
}

/* RadioGroup Skeleton */
interface RadioGroupSkeletonProps {
    count?: number
    className?: string
}

export const RadioGroupSkeleton = ({
                                       count = 3,
                                       className,
                                   }: RadioGroupSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <RadioSkeleton key={index} />
            ))}
        </div>
    )
}