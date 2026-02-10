"use client"

import {
    createContext,
    HTMLAttributes,
    ReactElement,
    ReactNode,
    RefObject,
    useContext,
    useLayoutEffect,
    useCallback,
    useState,
    useRef,
} from "react"
import {cn} from "@/shared/utils"
import {ContextException} from "@/shared/exceptions";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface PriorityContextType {
    containerRef: RefObject<HTMLDivElement | null>
    moreButtonRef: RefObject<HTMLButtonElement | null>
    itemsRef: RefObject<Map<string, HTMLElement>>
}

interface PriorityMainProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    renderItem: (item: T) => ReactElement
    renderMore: (items: T[]) => ReactElement | null
    height: number
}

interface PriorityNavigationProps<T> {
    items: T[]
    containerRef: RefObject<HTMLElement | null>
    itemsRef: RefObject<Map<string, HTMLElement>>
    moreButtonRef: RefObject<HTMLElement | null>
}

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------

export function calculateIntrinsicWidth<T extends HTMLElement>(el: T): number {
    const original = el.style.cssText

    el.style.display = "inline-block"
    el.style.width = "max-content"
    el.style.whiteSpace = "nowrap"
    el.style.position = "absolute"
    el.style.visibility = "hidden"

    const width = el.getBoundingClientRect().width

    el.style.cssText = original

    return width
}

// -----------------------------------------------------------------------------
// CONTEXT & HOOKS
// -----------------------------------------------------------------------------

const PriorityContext = createContext<PriorityContextType | null>(null)

export const usePriorityContext = () => {
    const ctx = useContext(PriorityContext)

    if (!ctx) {
        throw new ContextException('usePriorityContext', 'PriorityContext')
    }

    return ctx
}

export const usePriorityNavigation = <T, >({
                                               items,
                                               containerRef,
                                               itemsRef,
                                               moreButtonRef,
                                           }: PriorityNavigationProps<T>) => {
    const [isRedy, setIsRedy] = useState<boolean>(false)
    const [visibleItems, setVisibleItems] = useState<T[]>([])
    const [overflowItems, setOverflowItems] = useState<T[]>([])

    const calculate = useCallback(() => {
        const container = containerRef.current
        const moreBtn = moreButtonRef.current
        const elements = Array.from(itemsRef.current.values())

        if (!container || !moreBtn || elements.length === 0) return

        const containerStyle = window.getComputedStyle(container)

        const paddingX =
            parseFloat(containerStyle.paddingLeft) +
            parseFloat(containerStyle.paddingRight)
        const borderX =
            parseFloat(containerStyle.borderLeftWidth) +
            parseFloat(containerStyle.borderRightWidth)

        const containerTotalWidth = container.getBoundingClientRect().width
        const availableWidth = containerTotalWidth - paddingX - borderX

        const SAFETY_BUFFER = 20
        const moreButtonWidth = calculateIntrinsicWidth(moreBtn) + SAFETY_BUFFER

        let usedWidth = 0
        let visibleCount = 0

        for (let i = 0; i < elements.length; i++) {
            const itemWidth = calculateIntrinsicWidth(elements[i])
            const needsMoreButton = i < elements.length - 1
            const totalWidth = itemWidth + (needsMoreButton ? moreButtonWidth : 0)

            if (usedWidth + totalWidth <= availableWidth) {
                usedWidth += itemWidth
                visibleCount++
            } else {
                break
            }
        }

        setVisibleItems(items.slice(0, visibleCount))
        setOverflowItems(items.slice(visibleCount))
        setIsRedy(true)
    }, [items, containerRef, itemsRef, moreButtonRef])

    useLayoutEffect(() => {
        setIsRedy(false)
        calculate()

        const observer = new ResizeObserver(calculate)
        if (containerRef.current) observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [calculate, containerRef])

    return {visibleItems, overflowItems, isRedy}
}

// -----------------------------------------------------------------------------
// PRIORITY MAIN COMPONENT
// -----------------------------------------------------------------------------

const PriorityMain = <T, >({
                               items,
                               renderItem,
                               renderMore,
                               className,
                               height,
                               style,
                               ...rest
                           }: PriorityMainProps<T>) => {
    const {containerRef, itemsRef, moreButtonRef} = usePriorityContext()

    const {visibleItems, overflowItems, isRedy} = usePriorityNavigation<T>({
        items,
        containerRef,
        itemsRef,
        moreButtonRef,
    })

    return (
        <div
            ref={containerRef}
            className={cn("relative", className)}
            style={{
                ...style,
                height,
            }}
            {...rest}
        >
            {!isRedy && (
                <div className="flex size-full items-center justify-around gap-2 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-full shrink-0 animate-pulse rounded-2xl bg-[#F0F0F0]",
                                i % 2 === 0 ? "w-24" : "w-32",
                            )}
                        />
                    ))}
                </div>
            )}

            {isRedy && (
                <>
                    {visibleItems.map(renderItem)}
                    {overflowItems.length > 0 && renderMore(overflowItems)}
                </>
            )}

            <div
                className="invisible absolute left-0 top-0 flex flex-nowrap opacity-0 pointer-events-none"
                aria-hidden="true"
            >
                {overflowItems.length === 0 && (
                    <div className="shrink-0">{renderMore(items)}</div>
                )}

                {items.map((item, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            if (el) itemsRef.current.set(index.toString(), el)
                            else itemsRef.current.delete(index.toString())
                        }}
                        className="shrink-0"
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// PRIORITY PROVIDER
// -----------------------------------------------------------------------------

const PriorityProvider = ({children}: { children: ReactNode }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const moreButtonRef = useRef<HTMLButtonElement>(null)
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map())

    return (
        <PriorityContext.Provider
            value={{containerRef, moreButtonRef, itemsRef}}
        >
            {children}
        </PriorityContext.Provider>
    )
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
export const PriorityNavigation = Object.assign(PriorityProvider, {
    Main: PriorityMain,
})