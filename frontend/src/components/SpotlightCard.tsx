import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className,
    ...props
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm card-shadow card-hover transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default",
                className
            )}
            style={
                {
                    "--mouse-x": `${position.x}px`,
                    "--mouse-y": `${position.y}px`,
                } as React.CSSProperties
            }
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(212, 175, 55, 0.2), transparent 50%)`,
                }}
            />
            {/* Ensure content sits comfortably above the spotlight z-index */}
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
};
