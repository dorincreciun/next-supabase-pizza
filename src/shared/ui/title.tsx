import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils"
import { createElement } from "react"

const titleCva = cva(`font-bold`, {
    variants: {
        size: {
            xs: "text-[16px]",
            sm: "text-[22px]",
            md: "text-[26px]",
            lg: "text-[32px]",
            xl: "text-[36px] font-extrabold",
            "2xl": "text-[40px]",
        },
    },
    defaultVariants: {
        size: "xs",
    },
});

type TitleType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type SizeType = VariantProps<typeof titleCva>["size"];

export type TitleProps = {
    as: TitleType;
    size?: SizeType;
    className?: string;
    children: string;
};

export const Title = ({ as, children, size, className }: TitleProps) => {
    const buildTitleStyle = cn(titleCva({ size }), className);

    // eslint-disable-next-line react/no-children-prop
    return createElement(as, { children, className: buildTitleStyle });
};