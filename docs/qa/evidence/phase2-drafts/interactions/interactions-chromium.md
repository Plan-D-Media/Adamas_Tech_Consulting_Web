# Interactions phase2-drafts chromium (http://localhost:3100) 2026-11-16T14:12:41.136Z

## Mega menus (1440x900, mouse)
- PASS: four mega-menu triggers (header.about, header.services, header.solutions, header.insights)
- PASS: Case Studies is a plain link (1)
- PASS: header.about: hover intent (closed at 60ms, open by 320ms) (false -> true)
- PASS: header.about: panel present and labelled
- PASS: header.about: panel has links (2 links)
- PASS: header.about: pointer crossing the gap keeps it open
- PASS: header.about: close delay (open at 80ms, closed by 400ms) (true -> false)
- PASS: header.services: hover intent (closed at 60ms, open by 320ms) (false -> true)
- PASS: header.services: panel present and labelled
- PASS: header.services: panel has links (12 links)
- PASS: header.services: pointer crossing the gap keeps it open
- PASS: header.services: close delay (open at 80ms, closed by 400ms) (true -> false)
- PASS: header.solutions: hover intent (closed at 60ms, open by 320ms) (false -> true)
- PASS: header.solutions: panel present and labelled
- PASS: header.solutions: panel has links (9 links)
- PASS: header.solutions: pointer crossing the gap keeps it open
- PASS: header.solutions: close delay (open at 80ms, closed by 400ms) (true -> false)
- PASS: header.insights: hover intent (closed at 60ms, open by 320ms) (false -> true)
- PASS: header.insights: panel present and labelled
- PASS: header.insights: panel has links (2 links)
- PASS: header.insights: pointer crossing the gap keeps it open
- PASS: header.insights: close delay (open at 80ms, closed by 400ms) (true -> false)
- PASS: only one menu open after moving from one trigger to the next
- PASS: no flicker while the pointer crosses the trigger edge (0 state changes in 20 samples)
- PASS: click opens immediately
- PASS: second click closes
- PASS: Enter opens
- PASS: Tab moves focus into the panel
- PASS: Esc closes and returns focus to the trigger
- PASS: Space opens
- PASS: menu closes when focus leaves the nav (active: A )
- PASS: tabbing through the whole panel eventually closes it (16 tabs)
- PASS: external menu links have rel noopener (https://arivoo.in rel=noopener noreferrer; https://arivoo.in/arivoo-ums rel=noopener noreferrer; https://arivoo.in/arivoo-sms rel=noopener noreferrer; https://arivoo.in/arivoo-lms rel=noopener noreferrer)

## Mega menus with touch (1280x800, hasTouch)
- PASS: tap opens the menu
- PASS: second tap closes the menu

## Mobile drawer (390x844, touch)
- PASS: hamburger visible
- PASS: hamburger has an accessible name
- PASS: drawer opens
- PASS: body scroll locked
- PASS: focus moves into the drawer
- PASS: drawer has the three region links (3)
- PASS: drawer has the Talk to an expert button
- PASS: accordion opens
- PASS: accordion shows links (2)
- PASS: focus trapped inside the drawer (80 tabs) (0 escapes)
- PASS: focus trapped backwards (30 shift-tabs) (0 escapes)
- PASS: Esc closes the drawer
- PASS: Esc returns focus to the hamburger
- PASS: body scroll restored
- PASS: drawer closes after navigating (http://localhost:3100/contact)
- PASS: body scroll restored after navigation
- PASS: drawer region link sets the cookie ({"name":"region","value":"gcc","domain":"localhost","path":"/","expires":1826374381.710845,"httpOnly":false,"secure":false,"sameSite":"Lax"})

## Region switcher (1440)
- PASS: switcher labelled India on /in/ (India)
- PASS: top bar phone is the India number
- PASS: switcher opens
- PASS: switcher order India, UK & Ireland, GCC (India | UK & Ireland | GCC)
- PASS: no 'Middle East' in switcher
- PASS: Esc closes the switcher
- PASS: outside click closes the switcher
- PASS: switching to UK sets region=uk cookie ({"name":"region","value":"uk","domain":"localhost","path":"/","expires":1826374384.508286,"httpOnly":false,"secure":false,"sameSite":"Lax"})
- PASS: switch is fast (client navigation) (72ms)
- PASS: switcher now labelled UK & Ireland
- FAIL: after the region switch the DOM holds one header, one main and one h1 ({"headers":2,"mains":2,"h1":2,"mainIds":2,"firstMainVisible":true})
- FAIL: skip link still reaches the visible main after a client-side region switch
- PASS: top bar phone changed to the UK number (Call Us +44 7768 706988
marketing@adamastech.in)
- PASS: h1 lang attribute follows the region (en-GB)
- PASS: bare / now redirects to /uk/ from the cookie (307 /uk/)
- PASS: logo on an inner page links to the cookie region (/uk/)
- PASS: inner page switcher labelled UK & Ireland
- PASS: footer switcher opens
- PASS: footer switcher navigates to /gcc/
- PASS: GCC label never says Middle East

## Homepage components (1440, mouse)
- PASS: hero carousel has slides (3)
- PASS: hero next advances the counter (01 / 03 -> 02 / 03)
- PASS: hero prev returns
- PASS: hero prev from first wraps to last (03 / 03)
- PASS: hero survives 12 rapid clicks (counter valid) (03 / 03)
- PASS: hero ArrowRight advances
- PASS: hero has a pause control
- PASS: hero auto-advances within 7.8s (01 / 03 -> 02 / 03)
- PASS: pause stops the auto-advance
- PASS: progress bars match slide count
- PASS: stories next advances (01 / 03 -> 02 / 03)
- PASS: stories loop past the last slide without breaking (01 / 03)
- PASS: stories survive rapid prev clicks (03 / 03)
- PASS: story clones are aria-hidden and unfocusable (2 clones)
- INFO: stories after horizontal wheel: 03 / 03
- PASS: solutions next advances (01 / 10 -> 02 / 10)
- PASS: solutions stop at the last card (10 / 10)
- PASS: solutions return to the first card (01 / 10)
- PASS: solution external links have noopener (10 cards)
- PASS: three service tabs (3)
- PASS: clicking tab 2 selects it
- PASS: exactly one visible service panel (1)
- PASS: visible panel is labelled by the selected tab
- PASS: ArrowRight moves to tab 3
- PASS: ArrowRight wraps to tab 1
- PASS: End selects the last tab
- PASS: active tab panel image loaded
- PASS: industries side menu populated (12)
- PASS: side menu selects industry 4
- PASS: industry click does not change the URL hash (http://localhost:3100/in/)
- PASS: industry rail scrolled to the selected card (1842px)
- PASS: industry next moves selection to 5
- PASS: industry next disabled at the end
- PASS: industry last item selected
- PASS: industry prev disabled at the start
- INFO: Explore Industry targets: /contact
- PASS: Why Adamas diagram renders six cards (6)
- FAIL: presence map artwork loads (CSS background) (url("http://localhost:3100/media/images/home/presence-map.webp"))
- PASS: India homepage highlights the nearest office (YOUR NEAREST OFFICE)

## Touch screen components (390x844)
- PASS: hero track scroll (swipe) updates the counter (01 / 03 -> 02 / 03)
- PASS: tap selects service tab 3
- PASS: tap selects industry 3 on touch
- PASS: industry rail swipe updates the side menu
- PASS: no horizontal page overflow after interactions at 390 (0px)
- INFO: header region switcher visible at 390: false (expected hidden; lives in the drawer)
- INFO: header CTA visible at 390: false (design note: moves into the drawer under 640px)

## Keyboard pass (1280)
- PASS: first Tab lands on the skip link and it becomes visible ({"text":"Skip to content","href":"#main","visible":true})
- PASS: skip link moves focus to main
- INFO: first 40 tab stops: a "Skip to content" -> a "Call Us +91-6296680677" -> a "marketing@adamastech.in" -> a[Facebook (opens in a new tab)] "" -> a[LinkedIn (opens in a new tab)] "" -> a[AdamasTech Consulting, India homepage] "" -> button "About Us" -> button "Services" -> button "Solutions" -> a "Case Studies" -> button "Insights" -> summary[Region: India. Change region] "India" -> a "Talk to an expert" -> a "Talk to an expert" -> a "Explore services" -> div[Highlights] "Event, 26 November 2026 Join" -> a "Event, 26 November 2026 Join" -> a "Solutions Arivoo runs univer" -> a "Case study How SAP Treasury " -> button[Previous highlights] "" -> button[Pause highlights] "" -> button[Next highlights] "" -> button[Previous stories] "" -> button[Next stories] "" -> a "Read full story→" -> a "Read full story→" -> a "Read full story→" -> button[Pause the partner logos] "" -> div[Partners and certifications] "" -> a "Discover Adamas" -> button "Cloud Services" -> a "Migration & Modernization" -> a "DevOps & SecOps" -> a "Managed Services" -> a "AI/ML Ops" -> a "Cloud Automation" -> a "Cloud Advisory & Consultatio" -> a "Explore Cloud Services" -> a "All solutions" -> button[Previous solutions] ""
- PASS: every tab stop shows a focus indicator (outline or box-shadow)
- PASS: no tab stop is invisible
- FAIL: tabbing never lands on an element hidden by the reveal pre-state (120 tabs) (1 invisible stops)
- PASS: no focus trap: tabbing reaches the footer

## prefers-reduced-motion and 200% zoom
- PASS: reduced motion: no element left hidden by the reveal (0)
- PASS: reduced motion: partner marquee not animating (running/none)
- PASS: reduced motion: diagram pulse off (none/running)
- PASS: reduced motion: hero does not auto-advance
- INFO: pause control rendered under reduced motion: 0
- PASS: 200% zoom /in/: no horizontal overflow (0px)
- PASS: 200% zoom /services/cloud-services: no horizontal overflow (0px)
- PASS: 200% zoom /insights/events/house-of-lords-2026: no horizontal overflow (0px)

## Service page: sticky header anchor, tabs, accordion, FAQ
- PASS: #capabilities anchor is not hidden under the sticky header ({"top":133.953125,"headerBottom":118,"scrollY":4815})
- PASS: capabilities tabs present (6)
- PASS: capabilities tab 2 selected
- PASS: exactly one capabilities panel visible
- PASS: ArrowDown moves to tab 3
- PASS: platform accordion present, first open (4)
- PASS: accordion keeps one row open (name attribute) (1 open)
- PASS: FAQ rows present (10)
- PASS: FAQ row 2 opens
- PASS: header is sticky and marks the scrolled state ({"pos":"sticky","scrolled":true})

## No JavaScript (1440)
- PASS: no-JS /in/: all content visible ({"sections":15,"hiddenSections":[],"hiddenReveals":0,"tabPanels":3,"hiddenPanels":0,"navLinks":47,"forms":1,"h1":1,"text":12624})
- FAIL: no-JS /uk/: all content visible ({"sections":15,"hiddenSections":[],"hiddenReveals":0,"tabPanels":3,"hiddenPanels":1,"navLinks":47,"forms":1,"h1":1,"text":12616})
- FAIL: no-JS /gcc/: all content visible ({"sections":15,"hiddenSections":[],"hiddenReveals":0,"tabPanels":3,"hiddenPanels":1,"navLinks":47,"forms":1,"h1":1,"text":12396})
- FAIL: no-JS /services/cloud-services: all content visible ({"sections":13,"hiddenSections":[],"hiddenReveals":0,"tabPanels":6,"hiddenPanels":1,"navLinks":47,"forms":1,"h1":1,"text":8362})
- FAIL: no-JS /services/cloud-services/migration-modernization: all content visible ({"sections":5,"hiddenSections":[],"hiddenReveals":0,"tabPanels":5,"hiddenPanels":1,"navLinks":47,"forms":1,"h1":1,"text":2995})
- PASS: no-JS /insights/events/house-of-lords-2026: all content visible ({"sections":1,"hiddenSections":[],"hiddenReveals":0,"tabPanels":0,"hiddenPanels":0,"navLinks":47,"forms":1,"h1":1,"text":1808})
- PASS: no-JS /about: all content visible ({"sections":1,"hiddenSections":[],"hiddenReveals":0,"tabPanels":0,"hiddenPanels":0,"navLinks":47,"forms":0,"h1":1,"text":1444})
- PASS: no-JS /case-studies: all content visible ({"sections":1,"hiddenSections":[],"hiddenReveals":0,"tabPanels":0,"hiddenPanels":0,"navLinks":47,"forms":0,"h1":1,"text":2522})
- PASS: no-JS: drawer opens (details)
- PASS: no-JS: drawer links present (46)
- PASS: no-JS: drawer accordion opens
- PASS: no-JS: region switcher opens
- PASS: no-JS: region switch navigates
- PASS: no-JS: UK page shows the UK phone
- INFO: no-JS header nav links reachable without the mega menu: 47 (menus need JS; the drawer and footer carry the full tree)

## Console errors during the pass

- http://localhost:3100/in/ Failed to load resource: the server responded with a status of 404 (Not Found)
