import { cn } from "../lib/utils";
import { Link, ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes } from "react";

interface ShinyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {

}

// explicando as classes do tailwind
// group: permite usar o group hover ou group focus em elementos filhos
// relative : Posição relativa
// 	transform ativado (mesmo sem valor) para permitir transições futuras
// gap-2 gap: 0.5rem; (8px)
// overflow-hidden: Oculta qualquer conteudo que vaza da área visivel do container
// transition-all: Define quais propriedades css devem ser suavemente animadas. Quando usamos o all
// estamos dizendo que se qualquer propriedade mudar, então ele fará a transicao
// whitespace-nowrap: Evita quebras indesejadas de texto ou conteudo do elemento
// transition-transform: Define que apenas transformações css como scale, rotate, translate serão  suavimente animdas. Aqui estamos dizendo “Se eu mudar a transform, quero que a mudança aconteça de forma animada.”
export const ShinyButton = ({
    className,
    children,
    href,
    ...props
}: ShinyButtonProps) => {
    return (
        <a 
            href={href ?? "#"}
            className={cn(
                "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-brand-700 px-8 text-base/7 font-medium text-white transition-all duration-300 hover:ring-2 hover:ring-brand-700 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                className
            )}
            {...props}
            >
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <ArrowRight className="size-4 shrink-0 text-white transition-transform duration-300 ease-in-out group-hover:translate-x-[5px]" />
            </span>

            <div
                className="ease-[cubic-bezier(0.19,1,0.22,1)] absolute left-[-50px] -top-[50px] -z-10 h-[155px] w-7 rotate-[35deg] bg-white opacity-20 transition-all duration-500 group-hover:left-[120%]"
            ></div>
        </a>


    )
}