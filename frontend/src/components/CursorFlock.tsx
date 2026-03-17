import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CursorFlock = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHoveringClickable, setIsHoveringClickable] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over a clickable element to optionally enlarge the cursor or change behavior
            const target = e.target as HTMLElement;
            setIsHoveringClickable(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A'
            );
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Spring physics configs for organic "flocking" delay
    const springConfig1 = { stiffness: 600, damping: 28, mass: 0.5 };
    const springConfig2 = { stiffness: 400, damping: 30, mass: 0.8 };
    const springConfig3 = { stiffness: 300, damping: 35, mass: 1.2 };
    const springConfig4 = { stiffness: 150, damping: 40, mass: 2.0 };

    const x1 = useSpring(mousePosition.x, springConfig1);
    const y1 = useSpring(mousePosition.y, springConfig1);

    const x2 = useSpring(mousePosition.x, springConfig2);
    const y2 = useSpring(mousePosition.y, springConfig2);

    const x3 = useSpring(mousePosition.x, springConfig3);
    const y3 = useSpring(mousePosition.y, springConfig3);

    const x4 = useSpring(mousePosition.x, springConfig4);
    const y4 = useSpring(mousePosition.y, springConfig4);

    // Update springs when state changes
    useEffect(() => {
        x1.set(mousePosition.x);
        y1.set(mousePosition.y);

        x2.set(mousePosition.x);
        y2.set(mousePosition.y);

        x3.set(mousePosition.x);
        y3.set(mousePosition.y);

        x4.set(mousePosition.x);
        y4.set(mousePosition.y);
    }, [mousePosition, x1, y1, x2, y2, x3, y3, x4, y4]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
            {/* Primary fast dot */}
            <motion.div
                className="absolute h-2 w-2 rounded-full bg-primary/80 blur-[1px] mix-blend-multiply"
                style={{
                    x: x1,
                    y: y1,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHoveringClickable ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Secondary chaser */}
            <motion.div
                className="absolute h-3 w-3 rounded-full bg-foreground/60 blur-[2px] mix-blend-multiply"
                style={{
                    x: x2,
                    y: y2,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHoveringClickable ? 2 : 1,
                    opacity: isHoveringClickable ? 0.3 : 0.6,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Slower, larger shadowy shape */}
            <motion.div
                className="absolute h-6 w-6 rounded-full bg-foreground/20 blur-[4px] mix-blend-multiply"
                style={{
                    x: x3,
                    y: y3,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHoveringClickable ? 1.8 : 1,
                }}
                transition={{ duration: 0.4 }}
            />

            {/* Distant tail */}
            <motion.div
                className="absolute h-10 w-10 rounded-full bg-primary/10 blur-[8px] mix-blend-multiply"
                style={{
                    x: x4,
                    y: y4,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHoveringClickable ? 1.5 : 1,
                }}
                transition={{ duration: 0.5 }}
            />
        </div>
    );
};
