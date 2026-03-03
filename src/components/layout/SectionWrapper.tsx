import React from "react";

interface SectionWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    noBottomMargin?: boolean;
    fullWidth?: boolean;
}

/**
 * SectionWrapper
 * - Controls vertical rhythm PER SECTION
 * - Each section breathes independently
 */
const SectionWrapper: React.FC<SectionWrapperProps> = ({
    children,
    id,
    className = "",
    noBottomMargin = false,
    fullWidth = false,
}) => {
    return (
        <section
            id={id}
            className={`
        w-full
        relative
        py-16 md:py-24
        ${noBottomMargin ? "pb-0" : ""}
        ${className}
      `}
        >
            {fullWidth ? (
                children
            ) : (
                <div className="container mx-auto px-4">
                    {children}
                </div>
            )}
        </section>
    );
};

export default SectionWrapper;
