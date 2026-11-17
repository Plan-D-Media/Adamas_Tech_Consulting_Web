# Forms drafts (http://localhost:3100) 2026-11-16T06:21:54.178Z

- INFO: event row: {"id":"cmvtu9jq700c0u3dk6ddj0yvc","status":"DRAFT","registrationOpen":true,"startsAt":"2026-11-26T18:00:00.000Z","endsAt":null,"title":"[Placeholder] AdamasTech at the House of Lords"}
- PASS: event exists in the database

- PASS: contact form present on /in/
- PASS: honeypot field present and hidden
- PASS: honeypot excluded from the tab order
- PASS: empty submit shows a summary message (There are 4 problems with your message. Check the highlighted fields.)
- PASS: empty submit marks fields invalid (name, email, message) (3 aria-invalid)
- PASS: consent error shown when unchecked
- PASS: email error linked through aria-describedby (_R_3n5febtb_-email-error: Enter your email address.)
- PASS: inline email validation on blur
- PASS: inline phone validation on blur
- PASS: phone country selector defaults to India on /in/ and changes (India)
- PASS: country select has an accessible name
- PASS: country list has no 'Middle East'
- INFO: country options: India (+91) | United Kingdom (+44) | Ireland (+353) | United Arab Emirates (+971) | Saudi Arabia (+966) | Qatar (+974) | Kuwait (+965) | Bahrain (+973) | Oman (+968) | United States (+1) | Other
- PASS: valid contact submit redirects to /thank-you (http://localhost:3100/thank-you)
- PASS: thank-you page has one visible heading (Thank you for getting in touch)
- PASS: contact row saved once ([{"region":null,"sourcePath":"/in/","country":"India","phone":"+91 98765 43210","mailedAt":true,"ipHash":true}])
- PASS: contact row records sourcePath /in/ (/in/)
- PASS: contact row mailedAt set (console mailer)
- PASS: double-click creates one contact row (1 rows; button disabled while pending: false)
- PASS: honeypot: fake success, nothing stored (http://localhost:3100/thank-you rows 0)
- PASS: HTML in fields is not executed after an invalid submit (__xss=undefined)
- PASS: values echo back intact (Unicode preserved) (<img src=x onerror="window.__xss=1"><script>window.__xss=1</)
- PASS: phone '123' rejected (too short)
- PASS: Unicode/HTML submission stored raw (escaping is the renderer's job) (<img src=x onerror="window.__xss=1"><script>window.__xss=1</script>"'&lt;b&gt; न)
- PASS: country 'Other' accepted (Other)
- PASS: name over 120 chars rejected
- PASS: message over 5,000 chars rejected
- PASS: long input did not navigate away
- PASS: no-JS: contact form rendered
- PASS: no-JS: contact submit lands on /thank-you (200 http://localhost:3100/thank-you in 113ms)
- PASS: no-JS: contact row saved with sourcePath /uk/ and country UK ([{"sourcePath":"/uk/","country":"United Kingdom","region":null}])
- PASS: no-JS: invalid contact submit re-renders with errors (There are 4 problems with your message.)

- PASS: registration form present
- PASS: form labelled by its heading
- PASS: every visible field has a label
- PASS: empty registration shows role=alert summary (There are 3 problems with your registration. Check the highlighted fields.)
- PASS: name, email and consent errors
- PASS: short name, bad email, bad phone rejected
- PASS: valid registration shows the success panel with first name (REGISTRATION RECEIVED

Thank you, QA.

Your place at AdamasTech at the House of )
- PASS: success panel offers Add to calendar
- PASS: registration row saved ([{"company":"Plan D QA","jobTitle":"Tester","phone":"+44 7700 900000","notes":"QA audit test regist","consent":true,"mailedAt":true}])
- PASS: registration mailedAt set (console mailer)
- PASS: duplicate email (different case) answered as already registered (qa-audit-mwivlncy-event-valid@example.com is already registered for this event. There is no need to register again.)
- PASS: duplicate did not add a row
- PASS: event honeypot: fake success, nothing stored
- PASS: event double submit creates one row
- PASS: event HTML input not executed on error re-render
- PASS: notes over 1000 chars rejected
- PASS: job title Unicode echoed back
- PASS: Unicode/HTML registration accepted and first name rendered as text (REGISTRATION RECEIVED

Thank you, <img.

Your place at AdamasTech at the House o)
- PASS: Unicode stored intact
- PASS: no-JS: registration form rendered
- FAIL: no-JS: registration answers with the success panel (200 in 162ms)
- PASS: no-JS: registration row saved
- PASS: .ics served as text/calendar attachment (200 text/calendar; charset=utf-8; method=PUBLISH attachment; filename="house-of-lords-2026.ics")
- PASS: .ics uses CRLF line endings
- PASS: .ics has VCALENDAR/VEVENT, UID, DTSTAMP, DTSTART, SUMMARY
- PASS: .ics lines are 75 octets or fewer (max 73)
- PASS: .ics has no DTEND (no confirmed end time) or a valid one
- PASS: .ics SUMMARY carries no placeholder brackets (AdamasTech at the House of Lords)
- INFO: .ics

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AdamasTech Consulting//Events//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:house-of-lords-2026@adamastechconsulting.com
DTSTAMP:20261113T152419Z
DTSTART:20261126T180000Z
SUMMARY:AdamasTech at the House of Lords
DESCRIPTION:Details and registration: http://localhost:3000/insights/even
 ts/house-of-lords-2026
LOCATION:House of Lords\, Palace of Westminster\, London SW1A 0PW
URL:http://localhost:3000/insights/events/house-of-lords-2026
END:VEVENT
END:VCALENDAR
```
- PASS: .ics 404 for unknown event
- PASS: closed registration (database) is refused by the action (Registration for this event is closed.)
- INFO: the cached page still shows the form open until revalidation (cacheLife hours); the action checks the live row.

- PASS: event registration rate limit engages within 8 attempts (limited on attempt 1 (earlier valid registrations this run also count))
- PASS: contact rate limit engages within 8 attempts
- INFO: with a spoofed X-Forwarded-For the rate limit still applied: REGISTRATION RECEIVED

Thank you, QA.

Your place at AdamasT


## Console errors during the pass

none
