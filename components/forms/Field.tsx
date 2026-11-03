import type { ChangeEvent, FocusEvent, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

/**
 * Form controls for the site's forms. Same look as the event registration form (components/events):
 * 52px controls, 2px radius like the buttons, brand-blue focus border plus the global orange focus ring,
 * orange-700 inline errors with an icon, wired with aria-invalid / aria-describedby.
 */

const control =
  "block w-full rounded-btn border bg-white px-4 text-base text-navy-950 transition-[border-color,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) placeholder:text-grey-500 hover:border-grey-500 focus:border-brand-600";

export function Field({
  id,
  name,
  label,
  type = "text",
  required,
  error,
  hint,
  defaultValue,
  multiline,
  className,
  onBlur,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  defaultValue?: string;
  multiline?: boolean;
  className?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  maxLength?: number;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    defaultValue,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cx(control, error ? "border-orange-700 bg-orange-500/5" : "border-grey-300"),
    ...rest,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.9375rem] font-semibold text-navy-950">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-orange-700">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-grey-600">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-small text-grey-600">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...common} rows={6} className={cx(common.className, "mt-2 min-h-40 resize-y py-3")} />
      ) : (
        <input {...common} type={type} className={cx(common.className, "mt-2 h-13")} />
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small font-semibold text-orange-700">
      <Icon name="close" size={16} strokeWidth={2.25} className="mt-0.5 shrink-0" />
      {error}
    </p>
  );
}

export function Checkbox({
  id,
  name,
  error,
  children,
  className,
  onChange,
}: {
  id: string;
  name: string;
  error?: string;
  children: ReactNode;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <div className={cx("flex items-start gap-4 rounded-card p-4 ring-1", error ? "bg-orange-500/5 ring-orange-700" : "bg-grey-25 ring-grey-200")}>
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-[3px] accent-brand-600"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-relaxed text-grey-700">
          {children}
          <span aria-hidden="true" className="ml-0.5 text-orange-700">
            *
          </span>
        </label>
      </div>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}
