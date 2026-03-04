import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function AvatarImage({
    className,
    src,
    alt = "",
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={src}
            alt={alt}
            className={cn("aspect-square h-full w-full object-cover", className)}
            {...props}
        />
    )
}

function AvatarFallback({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full text-[10px] font-bold text-slate-500",
                className
            )}
            {...props}
        />
    )
}

export { Avatar, AvatarImage, AvatarFallback }
