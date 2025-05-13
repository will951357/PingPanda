import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    constentClassName?: string;
}

export const Card = ({className, constentClassName, children, ...props}: CardProps) => {
    return (
        <div 
            className={cn("relative rouded-lg bg-gray-50 text-card-foreground", className)}
            {...props}>


            <div className={cn("relative z-10 p-6", constentClassName)}>
                {children}
            </div>

        </div>
    )
}