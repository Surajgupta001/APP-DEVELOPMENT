import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";
import React, { forwardRef } from "react";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    Text,
    View,
} from "react-native";

export type ButtonVariant =
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive";

export type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps extends PressableProps {
    children?: React.ReactNode;
    className?: string;
    textClassName?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
    default: {
        container: "bg-primary border-transparent",
        text: "text-primary-foreground",
    },
    outline: {
        container: "bg-card border border-input-border",
        text: "text-foreground",
    },
    secondary: {
        container: "bg-secondary border-transparent",
        text: "text-secondary-foreground",
    },
    ghost: {
        container: "bg-transparent border-transparent",
        text: "text-foreground",
    },
    destructive: {
        container: "bg-destructive border-transparent",
        text: "text-destructive-foreground",
    },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
    sm: {
        container: "h-10 px-4 rounded-xl",
        text: "text-[13px]",
    },
    default: {
        container: "h-14 px-5 rounded-2xl",
        text: "text-[15px]",
    },
    lg: {
        container: "h-16 px-7 rounded-2xl",
        text: "text-[16px]",
    },
};

const Button = forwardRef<View, ButtonProps>(
    (
        {
            children,
            className,
            textClassName,
            variant = "default",
            size = "default",
            isLoading = false,
            disabled = false,
            leftIcon,
            rightIcon,
            style,
            ...props
        },
        ref,
    ) => {
        const primaryForeground = useAppThemeColor("primaryForeground");
        const foreground = useAppThemeColor("foreground");

        const indicatorColor =
            variant === "default" || variant === "destructive"
                ? primaryForeground
                : foreground;

        const v = variantStyles[variant] ?? variantStyles.default;
        const s = sizeStyles[size] ?? sizeStyles.default;

        return (
            <Pressable
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "relative flex-row items-center justify-center overflow-hidden",
                    v.container,
                    s.container,
                    (disabled || isLoading) && "opacity-50",
                    className,
                )}
                style={style}
                {...props}
            >
                {isLoading ? (
                    <ActivityIndicator color={indicatorColor} />
                ) : (
                    <>
                        {leftIcon && <View className="mr-2">{leftIcon}</View>}
                        {typeof children === "string" ? (
                            <Text
                                className={cn(
                                    "font-inter-semibold text-center",
                                    v.text,
                                    s.text,
                                    textClassName,
                                )}
                            >
                                {children}
                            </Text>
                        ) : (
                            children
                        )}
                        {rightIcon && <View className="ml-2">{rightIcon}</View>}
                    </>
                )}
            </Pressable>
        );
    },
);

Button.displayName = "Button";

export default Button;