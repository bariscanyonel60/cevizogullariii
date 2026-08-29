"use client";

import { useLayoutEffect, useRef, type InputHTMLAttributes } from "react";
import { Input } from "@/components/atoms/Input";
import { formatMoneyInput } from "@/lib/accounting-money";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "inputMode"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export function MoneyInput({
  value,
  onValueChange,
  ...props
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);

  useLayoutEffect(() => {
    const input = ref.current;
    const target = caretDigits.current;
    if (!input || target === null) return;
    caretDigits.current = null;
    if (target <= 0) {
      input.setSelectionRange(0, 0);
      return;
    }
    let seen = 0;
    let pos = value.length;
    for (let index = 0; index < value.length; index += 1) {
      if (/\d/.test(value[index] ?? "")) {
        seen += 1;
        if (seen === target) {
          pos = index + 1;
          break;
        }
      }
    }
    input.setSelectionRange(pos, pos);
  }, [value]);

  return (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={value}
      onChange={(event) => {
        const nextRaw = event.target.value;
        const caret = event.target.selectionStart ?? nextRaw.length;
        caretDigits.current = digitCount(nextRaw.slice(0, caret));
        onValueChange(formatMoneyInput(nextRaw));
      }}
    />
  );
}
