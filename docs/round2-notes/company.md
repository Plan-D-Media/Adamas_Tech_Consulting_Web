# Round 2: company and utility pages

Pages: `/about`, `/about/team`, `/about/careers`, `/credentials`, `/contact`, `/search`, `/thank-you`, `/privacy-policy`, `/cookie-policy`, `/terms-of-use`, and the 404 page.
Content source: `content/pages.ts` (seeded into `Page`), plus the existing `Person`, `Certification`, `Stat`, `Office` and `Region` rows.
Every item below is also flagged in its seed record (`needsReview` + `editorNote`).

Legend (as in `CONTENT_TODO.md`): **CONFLICT** = the live site contradicts itself · **MISSING** = no source content · **PLACEHOLDER** = rendered with a designed placeholder · **DECISION** = client choice needed · **INTERIM** = UI copy written for the prototype, for sign-off

## About (`/about`, source `about-us.md`)
- **CONFLICT / held back:** "Founded in 2021, Adamas Tech Consulting has rapidly expanded its presence across four countries: Saudi Arabia, England, the USA, and India." It is visible on the live page, but the founding year conflicts with the hidden "1995+ Year" and "22+ Years", and "four countries" leaves out the UAE (Dubai office, /ae/). The sentence is kept in `blocks.story.held` and is not rendered. The page shows a designed "Founding story and team size to be confirmed" note instead. **Client:** confirm the founding year and the country list.
- **Unverified / held back:** "With a team of over 100 experts, we blend deep industry knowledge…". The team size is not verified (stat `team-size-100`). It is held the same way. **Client:** confirm the headcount, or approve the sentence without the number.
- **Kept, but needs verification:** "As an ISO 9001 and ISO 27001 certified company and a CMMI Level 3 certification holder…". This is the client's own live wording, and the same badges already show on the homepages. Certificates, numbers and validity are still MISSING (Q5.9). Remove the sentence if the certificates cannot be supplied before launch.
- **MISSING (PLACEHOLDER):** RICE Adamas Group description (sitemap: About page content). Shown as a "Group description to be confirmed" card.
- **REVIEW:** the "Our Model" heading "How we do" is kept verbatim. Suggested wording: "How we work". The six steps are verbatim (the live icons split each step over two lines, e.g. "Discovery and / Vision Setting").
- "Why Choose Us" items are verbatim, including the US spelling "prioritize" and the missing full stops on three items. The site otherwise uses British English: **client**, confirm whether to normalise.
- Verified "about" stats render under the story automatically. None are verified today, so none show.
- SEO description: there is no meta description on the live site. It is drafted from the hero line.

## Team (`/about/team`)
- Names, roles and photos come from `content/people.ts` (unchanged). All three people are DRAFT (DECISION Q5.7). They show in this preview because `PREVIEW_DRAFTS=true`. In production the page shows a designed "Leadership profiles to be confirmed" panel until they are published.
- **MISSING (PLACEHOLDER):** a bio for each leader. Each row shows a "Biography to be confirmed" block.
- **MISSING:** LinkedIn URLs. The link renders automatically once a URL is set.
- **MISSING:** a page introduction. The hero runs without one. Title and eyebrow are the live "LEADERSHIP / Our Company Leading Members".
- Portraits: live images (about 470 px). Higher-resolution portraits are welcome. People without a photo get a designed monogram portrait.
- SEO description "The leadership of Adamas Tech Consulting." is INTERIM.

## Careers (`/about/careers`)
- Phase 2 (Q2.9, Q13.1). There is no careers content on the live site.
- **INTERIM:** the status "Coming soon", the panel heading "Coming soon: careers at AdamasTech" and the message "Our careers page is on its way. In the meantime, we would be glad to hear from you." are UI copy for sign-off. The page is noindex until it goes live.

## Credentials (`/credentials`)
- Hero and intro: the live "PARTNERS & CERTIFICATIONS / Trusted Partners & Certified Excellence" header (`in.md`). The section copy is the homepage "Certified Quality" item.
- **MISSING (Q5.9):** certificate PDF, certificate number and validity date for ISO 9001:2015 (BSI), ISO/IEC 27001 (DQS) and CMMI ML3. Nothing is verified, so each row shows "To be confirmed" / "Certificate to be supplied" tags. The number, date and download link render only when `Certification.verified = true`.
- **DECISION:** the AWS, SAP and Oracle NetSuite partner programmes are DRAFT rows (`content/trust.ts`). They show in preview with the tag "Programme and tier to be confirmed", and are hidden in production until published.
- "Partner programmes" and "Certifications" are UI labels.

## Contact (`/contact`, source `contact.md`)
- **TYPO FIXED:** "Lets get in touch" → "Let’s get in touch".
- Hero and form copy are verbatim. The live "Support / Contact our fast support team / marketing@adamastech.in" and "Phone / Mon-Fri from 9:30am to 6:30pm. / +91-6296680677" are shown beside the form.
- **DECISION:** the office hours belong to the India number. Confirm the hours per region (the regional numbers are listed in the hero).
- Offices: the 5 published "Our Presence" offices (PLAN D5). Harrow, Riyadh and Bhubaneswar (second /contact/ list) stay draft. All office conflicts are already in `CONTENT_TODO.md`.
- **Not migrated:** the Locations intro "Our location is strategically situated at the heart of City…" (theme filler, and it contradicts a multi-office presence).
- Form: the live fields Name, Email, Phone Number, Country and Message, plus the terms checkbox, which now also names the privacy policy. Phone is optional; the live form marks nothing. The arithmetic captcha is replaced by a honeypot plus rate limiting (5 per 10 minutes per hashed IP). **Client:** confirm the consent wording.
- Each submission stores `region` (from the `region` cookie), `sourcePath`, and `serviceContext` from a `?service=` hint on the contact URL. The hint is read in the browser, or from the Referer without JavaScript, so the page stays static.
- **INTERIM:** form microcopy (labels, hints, validation messages, "Send message").

## Thank you (`/thank-you`)
- **INTERIM:** the title "Thank you for getting in touch", the line "Your message has reached our team." and the "While you wait" next steps (Services, Success stories, Credentials) are UI copy. No response time is promised (the response-time stats are unverified). The page is always noindex.

## Legal pages
- **Privacy Policy** and **Terms of Use:** migrated verbatim from the live pages (Termly template, "Last updated February 15, 2024") by a converter. Presentation changes only:
  - all-caps section headings set in sentence case (e.g. "1. WHAT INFORMATION DO WE COLLECT?" → "1. What information do we collect?");
  - quotes typed as ‘…‘ on the live page corrected to ‘…’;
  - the live table of contents is replaced by the sticky contents list;
  - inline links (Termly DSAR form, regulators, Google opt-out, ICO) are listed under their section, because `Prose` has no inline links;
  - the privacy notice's categories table (section 12) is a real table, stacked on phones;
  - the terms' table of contents is an ordered list on the live page, so section numbers 1–22 are shown.
- **TYPOS FIXED (terms):** "Adamas Tech Consulting Private Limited ," → "…Limited," (twice); "CONTRIBUTIONLICENCE" → "Contribution licence".
- **CONFLICT (legal review before launch):** the legal pages give the registered address "2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru 560068" and the emails Info@ / info@ / hr@adamastech.in. The privacy notice names Arun Bardhan (39 Roxborough Road, Harrow) as UK representative. Both documents say the website is https://adamastech.in. The terms link their privacy policy to https://adamastech.in/privacy/; that link now points to this site's `/privacy-policy`. The privacy notice's "Cookie Notice" reference links to `/cookie-policy`.
- The page title is "Terms of Use" (live page title "Terms of use"); the document itself is headed "Terms of Service" (kept as the document label).
- **MISSING (PLACEHOLDER):** Cookie Policy text (Q10.2–Q10.4). `/cookie-policy` shows a designed "Policy text to be supplied" panel and is noindex until the text arrives.

## Search (`/search`)
- Static route. The cached index (services and pillars, solutions, case studies, events, published Page rows and the main listing pages) is rendered into the page and filtered in the browser. `?q=` is kept in step with `history.replaceState`. Draft items appear only in preview.
- Descriptors are the items' own taglines or summaries. Placeholder instructions are dropped. INTERIM: the static entry "Services: Cloud, digital transformation and AI services." (from the services page metadata).
- noindex, follow.

## 404
- Same copy as before. It now uses the inner-page hero, plus a site search box and four section links.

## Shared-file change requests
1. **`app/api/revalidate/route.ts`:** add `"pages"`, `"people"`, `"certifications"`, `"stats"`, `"search"` and `"services"` to `ALL_TAGS`. Until then, every reader in `lib/data/pages.ts` and `lib/data/search.ts` also carries the `"blocks"` tag, so a seed run still refreshes them.
2. **`components/ui/Prose.tsx`:** support inline links (e.g. `[label](url)` and bare emails). The legal pages then would not need per-section link lists, and emails in body copy would become mailto links.
3. **`app/sitemap.ts`:** include `/about`, `/about/team`, `/credentials`, `/contact`, `/privacy-policy` and `/terms-of-use`. Exclude `/thank-you`, `/search`, `/about/careers` and `/cookie-policy` (noindex).
4. **Forms:** `components/forms/Field.tsx` duplicates the field styling in `components/events/RegistrationForm.tsx` (same classes). Suggest the events form imports it. Each folder also has its own copy of the honeypot field name (`components/forms/honeypot.ts`, `components/events/honeypot.ts`); one client-safe constant should live in `lib/`.
5. **Service pages:** to fill `serviceContext`, link "Talk to an expert" to `/contact?service=<pillar>/<service>` (it is currently plain `/contact`).
6. **Header:** the search icon already links to `/search`, so no change is needed. D9's overlay is not built; the page is the search experience.
