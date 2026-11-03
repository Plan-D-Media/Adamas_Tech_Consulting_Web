# Round 2: Events and Insights

Routes: `/insights` (hub), `/insights/events` (listing), `/insights/events/[slug]` (event page, launch priority: `house-of-lords-2026`), `/insights/events/[slug]/calendar` (.ics download), `/insights/blog` (coming soon + newsletter).

Files: `app/insights/**`, `lib/data/events.ts`, `components/events/**` (EventCard, EventParts, RegistrationForm, actions, format, honeypot), `components/newsletter/**` (NewsletterForm, actions; reusable on any page via `<NewsletterForm permalink="/page" tone="light|dark" />`).

## Placeholders and items to confirm

### House of Lords event (Q6.1–Q6.6), launch priority
- MISSING: **full event title.** The DB title is a placeholder, shown as "AdamasTech at the House of Lords" with a "Title to be confirmed" tag (hero, listing, cards, .ics).
- MISSING: **eyebrow** (shown as "Event").
- MISSING: **one-paragraph summary.** Hidden until supplied (hero intro, listing card, meta description, .ics description and JSON-LD fall back to date and venue).
- MISSING: **full description, host and sponsor wording.** The "About the event" section shows a "Event description to be confirmed" panel.
- MISSING: **start and end time.** 18:00 is a seeded placeholder (only 26 Nov comes from the sitemap); there is no end time. The hero, facts panel and form show "Finish time to be confirmed". The .ics has no end time until one is set. The countdown counts to 18:00 GMT.
- MISSING: **agenda.** Three placeholder items (18:00 arrival and registration, 18:30 keynote, 19:30 networking reception): times, titles and descriptions. Each shows "Details to be confirmed"; the section shows "Timings to be confirmed".
- MISSING: **speakers** (names, roles, photos, bios, LinkedIn). No EventSpeaker rows; the section shows "Speakers to be announced" with three designed placeholder places. Speakers are added as EventSpeaker → Person rows (Person needs status PUBLISHED, or DRAFT in preview).
- DECISION: **venue name and address** ("House of Lords, Palace of Westminster, London SW1A 0PW"), and the room. Shown as seeded.
- MISSING: **getting there**: arrival, entrance, security and accessibility notes. The venue section shows "Arrival, access and security details to be confirmed".
- MISSING: **capacity** (when set, the page shows "Limited to N guests").
- MISSING: **imagery** (event image and OG image). Branded artwork stands in on the hero, cards and venue block.
- DECISION: **registration fields.** Built from the EventRegistration model: full name*, work email*, organisation, job title, phone, notes (for example accessibility or dietary requirements), consent*. Confirm whether anything else is needed (for example dietary requirements as a separate field, or a guest).
- DECISION: **registration consent wording** (currently: "I agree to AdamasTech storing these details to manage my registration, as described in the Privacy Policy.") and the confirmation copy ("we will be in touch by email with the final details").
- DECISION: **confirmation email** to registrants. Today `sendMail` (console mailer) sends a notification to `MAIL_TO_ENQUIRIES` and a plain confirmation to the registrant. Wording and sender to confirm when SES is set up.

### Events listing (Q6.7)
- MISSING: past events. The "Past events" section shows a designed empty state with the newsletter signup.

### Blog (coming soon, Q2.6 / Phase 2)
- DECISION: blog launch timing; the page is a "Coming soon" page with newsletter signup.
- MISSING: **newsletter provider and consent wording** (CONTENT_TODO "Legal and global"). Current label: "I would like to receive email updates from AdamasTech. I can unsubscribe at any time; see the Privacy Policy." Subscribers are stored in NewsletterSubscriber (email, consent, region from the region cookie). There is no unsubscribe flow yet.

### Interim UI copy (short labels written for this round, client to approve)
- `/insights/events` intro: "Upcoming and past AdamasTech events, with dates, venues and registration."
- `/insights` intro: "Events and articles from AdamasTech Consulting."; newsletter band: "Stay in the loop" / "New events and articles, straight to your inbox."
- `/insights/blog` intro: "Our blog is coming soon. Subscribe and we will email you when the first articles are published."

## Shared-file change requests
1. `lib/forms.ts`: move `HONEYPOT` into a client-safe module (it is server-only today). `components/events/honeypot.ts` keeps a copy (`company_website`) that must stay in sync.
2. `components/ui/Icon.tsx`: a `ticket` or `microphone` glyph would help the speaker and registration visuals (currently `users` / `calendar`).
3. Not-found for unknown slugs renders the 404 UI with a 200 status (streaming inside Suspense). Same as `/services/[pillar]/[service]`; a site-wide decision.
4. `content/navigation.ts`: the Insights mega-menu could link to the new `/insights` hub (not linked anywhere yet; breadcrumbs on the Insights pages link to it).
5. Cache: event pages use `cacheTag("events", "event:<slug>")`; the revalidate webhook should purge `events` when an event, agenda item or speaker changes.
