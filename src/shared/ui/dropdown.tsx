"use client"
import {
    ButtonHTMLAttributes,
    createContext,
    HTMLAttributes,
    MouseEvent,
    ReactNode, Ref, RefObject,
    useContext,
    useState,
} from "react"

/* Dropdown Context */
interface DropdownContextProps {
    isOpen: boolean
    toggle: () => void
    closeOnSelect: boolean
}

const DropdownContext = createContext<DropdownContextProps | null>(null)

/* Dropdown Hook */
const useDropdownContext = () => {
    const ctx = useContext(DropdownContext)
    if (!ctx) {
        throw new Error("useDropdownContext must be used within DropdownContext")
    }
    return ctx
}

/* DropdownTrigger */
type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">

interface DropdownTriggerProps extends NativeButtonProps {
    className?:
        | ((state: { isOpen: boolean }) => string | undefined)
        | (string | undefined)
    ref?: Ref<HTMLButtonElement>
}

const DropdownTrigger = ({ onClick, className, ...rest }: DropdownTriggerProps) => {
    const { toggle, isOpen } = useDropdownContext()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        toggle()
    }

    const resolvedClassName =
        typeof className === "function" ? className({ isOpen }) : className

    return <button
        onClick={handleClick}
        className={resolvedClassName}
        aria-expanded={isOpen}
        data-open={isOpen ? "true" : "false"} {...rest} />
}

/* DropdownItem */
type NativeDropdownItemProps = ButtonHTMLAttributes<HTMLDivElement>

const DropdownItem = ({ onClick, ...rest }: NativeDropdownItemProps) => {
    const { closeOnSelect, toggle } = useDropdownContext()
    return <div
        onClick={(event) => {
            if (closeOnSelect) {
                toggle()
            }
            onClick?.(event)
        }} {...rest} />
}

/* DropdownContent */
type NativeDropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "className">

interface DropdownContentProps extends NativeDropdownProps {
    className?:
        | ((state: { isOpen: boolean }) => string | undefined)
        | (string | undefined)
}

function DropdownContent({ className, ...rest }: DropdownContentProps) {
    const { isOpen } = useDropdownContext()

    if (!isOpen) return null

    const resolvedClassName =
        typeof className === "function" ? className({ isOpen }) : className

    return <div className={resolvedClassName} {...rest} />
}

/* DropdownRoot */
interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    defaultOpen?: boolean
    children: ReactNode
    closeOnSelect?: boolean
}

const DropdownRoot = ({ defaultOpen, children, closeOnSelect, ...rest }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen ?? false)
    const toggle = () => setIsOpen((prev) => !prev)
    return (
        <DropdownContext value={{ isOpen, toggle, closeOnSelect: closeOnSelect ?? false }}>
            <div {...rest}>
                {children}
            </div>
        </DropdownContext>
    )
}

/* Dropdown API */
export const Dropdown = Object.assign(DropdownRoot, {
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
})
