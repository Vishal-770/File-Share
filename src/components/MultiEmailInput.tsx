"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export interface MultiEmailInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxRecipients?: number;
}

export function MultiEmailInput({
  value,
  onChange,
  label,
  description,
  placeholder = "Add recipient emails",
  disabled = false,
  className,
  maxRecipients,
}: MultiEmailInputProps) {
  const inputId = React.useId();
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const normalizedSet = React.useMemo(
    () => new Set(value.map((email) => email.toLowerCase())),
    [value]
  );

  const updateEmails = (next: string[]) => {
    onChange(next);
    if (!next.length) {
      setError(null);
    }
  };

  const addEmailsFromString = (raw: string) => {
    if (disabled || !raw.trim()) {
      setInputValue("");
      return;
    }

    if (maxRecipients && value.length >= maxRecipients) {
      setError(`You can add up to ${maxRecipients} recipients per email.`);
      setInputValue("");
      return;
    }

    const fragments = raw
      .split(/[\s,;]+/)
      .map((fragment) => fragment.trim())
      .filter(Boolean);

    if (!fragments.length) {
      setInputValue("");
      return;
    }

    const invalid = fragments.find((fragment) => !EMAIL_PATTERN.test(fragment));
    if (invalid) {
      setError(`Invalid email: ${invalid}`);
      setInputValue("");
      return;
    }

    const nextEmails: string[] = [];
    const nextSet = new Set(normalizedSet);

    for (const fragment of fragments) {
      if (maxRecipients && value.length + nextEmails.length >= maxRecipients) {
        break;
      }

      const normalized = fragment.toLowerCase();
      if (!nextSet.has(normalized)) {
        nextSet.add(normalized);
        nextEmails.push(fragment);
      }
    }

    if (!nextEmails.length) {
      setError("Recipient already added");
      setInputValue("");
      return;
    }

    setError(null);
    setInputValue("");
    updateEmails([...value, ...nextEmails]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ",", ";"].includes(event.key)) {
      event.preventDefault();
      addEmailsFromString(inputValue);
    } else if (event.key === "Backspace" && !inputValue && value.length) {
      event.preventDefault();
      updateEmails(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmailsFromString(inputValue);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (pasted.includes(",") || pasted.includes(" ") || pasted.includes(";")) {
      event.preventDefault();
      addEmailsFromString(pasted);
    }
  };

  const helperText = maxRecipients
    ? `Add up to ${maxRecipients} recipients. Press Enter, comma, or paste a list to add.`
    : "Press Enter, comma, or paste multiple addresses to add recipients.";

  return (
    <div className={cn("space-y-2", className)}>
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <Label htmlFor={inputId} className="text-sm font-medium">
              {label}
            </Label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "rounded-lg border border-border bg-card/70 px-3 py-2 transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((email) => (
            <Badge
              key={email}
              variant="secondary"
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
            >
              {email}
              <button
                type="button"
                onClick={() =>
                  updateEmails(value.filter((item) => item !== email))
                }
                className="text-muted-foreground/80 transition hover:text-destructive"
                aria-label={`Remove ${email}`}
                disabled={disabled}
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          ))}
          <input
            id={inputId}
            type="email"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder={value.length ? undefined : placeholder}
            className="flex-1 min-w-[200px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-disabled={disabled}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{helperText}</span>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => updateEmails([])}
              disabled={disabled}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
