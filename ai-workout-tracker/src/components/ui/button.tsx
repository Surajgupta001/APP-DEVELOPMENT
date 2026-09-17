import type { ComponentRef, ReactNode } from "react";
import type { PressableProps } from "react-native";
import { forwardRef } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useAppThemeColor } from "@/theme/app-theme";
import { cn } from "@/lib/utils";

const variants = {
    default: {
        button: "border-primary bg-primary active:bg-primary-hover",
        text: "text-primary-foreground",
    },
    outline: {
        button: "border-border bg-card active:bg-muted",
        text: "text-foreground",
    },
    secondary: {
        button: "border-secondary bg-secondary active:bg-muted",
        text: "text-secondary-foreground",
    },
} as const;

type ButtonProps = PressableProps & {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    size?: "default" | "sm";
    isLoading?: boolean;
    variant?: keyof typeof variants;
};

const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
    (
        {
            children,
            className,
            disabled,
            leftIcon,
            rightIcon,
            isLoading,
            size = "default",
            variant = "default",
            ...props
        },
        ref,
    ) => {
        const primaryForeground = useAppThemeColor("primaryForeground");
        const foreground = useAppThemeColor("foreground");
        const secondaryForeground = useAppThemeColor("secondaryForeground");

        const textColor =
            variant === "default"
                ? primaryForeground
                : variant === "outline"
                    ? foreground
                    : secondaryForeground;

        return (
            <Pressable
                ref={ref}
                accessibilityRole="button"
                className={cn(
                    "flex-row items-center justify-center gap-2 rounded-xl border px-5",
                    size === "sm" ? "h-11" : "h-14",
                    variants[variant].button,
                    disabled && "opacity-50",
                    className,
                )}
                disabled={Boolean(disabled)}
                {...props}
            >
                {!isLoading ? (
                    leftIcon
                ) : (
                    <ActivityIndicator color={primaryForeground} />
                )}

                <Text
                    className={cn(
                        "text-center font-inter-semibold",
                        size === "sm" ? "text-[13px]" : "text-[14px]",
                    )}
                    style={{
                        color: textColor,
                    }}
                >
                    {children}
                </Text>

                {rightIcon}
            </Pressable>
        );
    },
);

Button.displayName = "Button";

export default Button;