import {Overlay, Portal} from "@/shared/ui";
import {cn} from "@/shared/utils";
import {ReactNode} from "react";

interface Props {
    children: ReactNode
}

export const AuthModal = ({children}: Props) => {
    return (
        <Portal>
            <Overlay/>
            <div className={cn([
                'absolute top-1/2 left-1/2 -translate-1/2 z-50',
                'max-w-112.5 w-full p-11.5 rounded-[18px] bg-white',
                'space-y-5'
            ])}>
                {children}
            </div>
        </Portal>
    )
}