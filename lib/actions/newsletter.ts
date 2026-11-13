"use server";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { HONEYPOT, clientIpHash, enquiriesInbox, rateLimit, sendMail } from "@/lib/forms";
import { REGION_COOKIE, isRegionSlug, slugToCode } from "@/lib/region";

export interface NewsletterState {
  status: "idle" | "error" | "success" | "already" | "limited";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "consent", string>>;
  email?: string;
}

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Enter your email address." })
    .max(254, { error: "Email address is too long." })
    .pipe(z.email({ error: "Enter an email address in the correct format, like name@company.com." }))
    .transform((v) => v.toLowerCase()),
  consent: z.literal("on", { error: "Please confirm you would like to receive these emails." }),
});

export async function subscribeToNewsletter(_prev: NewsletterState, fd: FormData): Promise<NewsletterState> {
  const rawEmail = typeof fd.get("email") === "string" ? (fd.get("email") as string) : "";
  if (fd.get(HONEYPOT)) return { status: "success" };

  const parsed = schema.safeParse({ email: rawEmail, consent: fd.get("consent") ?? "" });
  if (!parsed.success) {
    const fe = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Please check the highlighted details.",
      fieldErrors: { email: fe.email?.[0], consent: fe.consent?.[0] },
      email: rawEmail,
    };
  }

  const ipHash = await clientIpHash();
  if (!(await rateLimit(`newsletter:${ipHash}`, 5, 600))) {
    return { status: "limited", message: "Too many attempts from this connection. Please wait a few minutes and try again.", email: rawEmail };
  }

  const regionSlug = (await cookies()).get(REGION_COOKIE)?.value;
  const region = isRegionSlug(regionSlug) ? slugToCode[regionSlug] : null;
  const { email } = parsed.data;

  try {
    await db.newsletterSubscriber.create({ data: { email, consent: true, region } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { status: "already", message: `${email} is already on the list. There is nothing more to do.` };
    }
    console.error("[newsletter]", e);
    return { status: "error", message: "Something went wrong on our side. Please try again in a moment.", email: rawEmail };
  }

  await sendMail({ to: enquiriesInbox(), subject: "New newsletter subscriber", text: `Email: ${email}\nRegion: ${region ?? "-"}` });
  return { status: "success", message: `Thanks. ${email} is now subscribed.` };
}
