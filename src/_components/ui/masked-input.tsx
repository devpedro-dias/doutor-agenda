"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface MaskedInputProps {
  mask?: "cpf" | "phone" | "cep";
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  // React Hook Form props
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      className,
      mask,
      onValueChange,
      value,
      onChange,
      onBlur,
      name,
      placeholder,
      disabled,
      ...props
    },
    ref,
  ) => {
    const applyMask = (input: string, maskType?: string): string => {
      // Remove all non-numeric characters
      const cleanInput = input.replace(/\D/g, "");

      switch (maskType) {
        case "cpf":
          if (cleanInput.length <= 11) {
            return cleanInput
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
              .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
          }
          return cleanInput
            .substring(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");

        case "phone":
          if (cleanInput.length <= 11) {
            return cleanInput
              .replace(/(\d{2})(\d)/, "($1) $2")
              .replace(/(\(\d{2}\)\s)(\d{5})(\d{1,4})/, "$1$2-$3");
          }
          return cleanInput
            .substring(0, 11)
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\(\d{2}\)\s)(\d{5})(\d{1,4})/, "$1$2-$3");

        case "cep":
          if (cleanInput.length <= 8) {
            return cleanInput.replace(/(\d{5})(\d{1,3})/, "$1-$2");
          }
          return cleanInput
            .substring(0, 8)
            .replace(/(\d{5})(\d{1,3})/, "$1-$2");

        default:
          return input;
      }
    };

    const getPlaceholder = (maskType?: string): string => {
      switch (maskType) {
        case "cpf":
          return placeholder || "000.000.000-00";
        case "phone":
          return placeholder || "(11) 99999-9999";
        case "cep":
          return placeholder || "00000-000";
        default:
          return placeholder || "";
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const maskedValue = applyMask(inputValue, mask);

      // Create new event with masked value
      const maskedEvent = {
        ...event,
        target: {
          ...event.target,
          value: maskedValue,
        },
        currentTarget: {
          ...event.currentTarget,
          value: maskedValue,
        },
      };

      // Call the original onChange
      onChange?.(maskedEvent);

      // Call custom onValueChange
      onValueChange?.(maskedValue);
    };

    const displayValue = value ? applyMask(value, mask) : "";

    return (
      <input
        ref={ref}
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={getPlaceholder(mask)}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
