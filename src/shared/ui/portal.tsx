"use client"

import { type ReactNode, useEffect, useState } from "react"
import ReactDOM from "react-dom"

interface IPortalProps {
    children: ReactNode
}

export const Portal = ({ children }: IPortalProps) => {
    // 1. Monitorizăm dacă suntem pe client
    const [mounted, setMounted] = useState(false)
    const [container] = useState(() =>
        typeof document !== "undefined" ? document.createElement("div") : null
    )

    useEffect(() => {
        setMounted(true)
        if (container) {
            document.body.appendChild(container)
        }

        return () => {
            if (container) {
                document.body.removeChild(container)
            }
        }
    }, [container])

    // 2. În timpul SSR (sau până la montare), returnăm null
    if (!mounted || !container) return null

    return ReactDOM.createPortal(children, container)
}