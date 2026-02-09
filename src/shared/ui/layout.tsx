import { HTMLAttributes } from "react"

export const Layout = ({...rest}: HTMLAttributes<HTMLDivElement>) => {
    return <div {...rest} />
}