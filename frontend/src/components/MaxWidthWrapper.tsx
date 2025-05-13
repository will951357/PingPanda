import { cn } from "../lib/utils"
import type { ReactNode } from "react"

interface MaxWidthWrapperProps {
    className? : string,
    children: ReactNode
}

// O que a função cn faz???
// É uma função que permite realizar o merge entre as classes padrões que serão aplicadas ao compnente
//  e as classes que virão de className
// ela resolve os conflitos priorisando as classes de className

export const MaxWidthWrapper = ({className, children}: MaxWidthWrapperProps) => {
    return (
        <div 
            className={cn("h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}
        >
            {children}
        </div>
    )
}