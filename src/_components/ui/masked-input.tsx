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
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
