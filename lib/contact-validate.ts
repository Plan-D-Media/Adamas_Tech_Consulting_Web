import type { ContactField } from "@/lib/contact-schema";

/**
 * Browser-side field checks for the contact form (on blur). Mirrors lib/contact-schema.ts (zod, the authoritative
 * server check) without shipping zod to the client (34 KB gzipped, Lighthouse round 7). Keep the messages in step.
 */
export function fieldError(field: ContactField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "name":
      if (v.length < 2) return "Enter your name.";
      if (v.length > 120) return "Name must be 120 characters or fewer.";
      return undefined;
    case "email":
      if (!v) return "Enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter an email address in the correct format, like name@company.com.";
      return undefined;
    case "phone":
      if (v.length > 40) return "Phone number must be 40 characters or fewer.";
      if (v && !/^[+()\d\s.-]{6,}$/.test(v)) return "Enter a phone number using digits, spaces and an optional +.";
      return undefined;
    case "country":
      if (v.length < 2) return "Enter your country.";
      if (v.length > 80) return "Country must be 80 characters or fewer.";
      return undefined;
    case "message":
      if (v.length < 10) return "Enter a message of at least 10 characters.";
      if (v.length > 5000) return "Message must be 5,000 characters or fewer.";
      return undefined;
    case "consent":
      return v === "on" ? undefined : "Please agree to the terms of use and privacy policy so we can reply.";
  }
}
