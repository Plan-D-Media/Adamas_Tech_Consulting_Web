# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: forms.spec.ts >> contact form >> HTML in a field is escaped where it is shown back
- Location: tests\e2e\forms.spec.ts:78:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-compare="contact"] form').locator('[role=\'status\']')
Expected pattern: /problem/i
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('[data-compare="contact"] form').locator('[role=\'status\']') with timeout 10000ms
  - waiting for locator('[data-compare="contact"] form').locator('[role=\'status\']')

```

```yaml
- link "Skip to content":
  - /url: "#main"
- banner:
  - link "Call Us +91-6296680677":
    - /url: tel:+916296680677
  - link "marketing@adamastech.in":
    - /url: mailto:marketing@adamastech.in
  - list "Social media":
    - listitem:
      - link "Facebook (opens in a new tab)":
        - /url: https://www.facebook.com/AdamasTechConsulting/
    - listitem:
      - link "LinkedIn (opens in a new tab)":
        - /url: https://www.linkedin.com/company/adamas-tech-consulting/
  - link "AdamasTech Consulting, India homepage":
    - /url: /in/
  - navigation "Main":
    - list:
      - listitem:
        - button "About Us"
      - listitem:
        - button "Services"
      - listitem:
        - button "Solutions"
      - listitem:
        - link "Case Studies":
          - /url: /case-studies
      - listitem:
        - button "Insights"
  - group: India
  - link "Talk to an expert":
    - /url: /contact
- main:
  - region "Powering Enterprise Excellence With Cloud, SAP & AI":
    - paragraph: India Engineering Delivery Center · Kolkata & Pan-India
    - heading "Powering Enterprise Excellence With Cloud, SAP & AI" [level=1]
    - paragraph: Accelerating digital sovereignty, automated e-invoicing compliance, and mission-critical cloud modernization for governments and top enterprises across India.
    - link "Talk to an expert":
      - /url: /contact
    - link "Explore services":
      - /url: /services
    - region "Highlights":
      - group "1 of 1":
        - link "A student holding a laptop and books on campus Solutions Arivoo runs universities, schools and learning programmes (opens in a new tab)":
          - /url: https://arivoo.in
          - img "A student holding a laptop and books on campus"
          - paragraph: Solutions
          - paragraph: Arivoo runs universities, schools and learning programmes
          - text: (opens in a new tab)
  - region "Latest Insights, Success Stories and What's Next":
    - paragraph: Top Stories
    - heading "Latest Insights, Success Stories and What's Next" [level=2]
    - paragraph: Explore our latest news, client success stories, industry insights and upcoming events shaping a smarter, digital future.
    - article:
      - img "A modern glass office building with the AdamasTech logo"
      - paragraph: 29 October 2026
      - heading "Adamas accelerates enterprise transformation with AI-driven solutions" [level=3]
      - paragraph: Discover how Adamas Tech Consulting is leveraging advanced AI and cloud technologies to drive efficiency, innovation, and measurable business impact across global operations.
      - link "Read full story→":
        - /url: /insights
  - region "Trusted Partners & Certified Excellence":
    - paragraph: Partners & Certifications
    - heading "Trusted Partners & Certified Excellence" [level=2]
    - paragraph: Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.
    - button "Pause the partner logos"
    - region "Partners and certifications":
      - list:
        - listitem:
          - img "AWS Partner Network"
        - listitem:
          - img "Cloudera"
        - listitem:
          - img "SAP Partner Open Ecosystem"
        - listitem:
          - img "Google Developers Agency Program"
        - listitem:
          - img "AWS"
        - listitem:
          - img "SAP"
        - listitem:
          - img "Oracle NetSuite"
        - listitem:
          - img "MigNow"
        - listitem:
          - img "Leapwork"
        - listitem:
          - img "Flipkart"
        - listitem:
          - img "techUK"
        - listitem:
          - img "London Chamber of Commerce and Industry (LCCI)"
        - listitem:
          - img "Open edX"
  - region "Technology That Moves Businesses Forward":
    - paragraph: About Adamas
    - heading "Technology That Moves Businesses Forward" [level=2]
    - paragraph: Adamas Tech Consulting brings together enterprise technology expertise, strategic thinking and implementation capabilities to help organisations solve complex business challenges and build future-ready operations.
    - paragraph: We connect business ambition with practical implementation across cloud, SAP, AI, data and digital platforms—supporting Indian enterprises and institutions through our engineering and technology delivery capability.
    - link "Discover Adamas":
      - /url: /about
    - list:
      - listitem: Global delivery
      - listitem: Senior-led teams
      - listitem: Quality focused
    - img "Three colleagues working together at a laptop"
    - paragraph: Our approach
    - paragraph: Business-first. Technology-enabled.
  - region "Transforming Enterprise Capabilities Through Technology":
    - paragraph: Our Services
    - heading "Transforming Enterprise Capabilities Through Technology" [level=2]
    - paragraph: Cloud, SAP, digital and AI capabilities designed to strengthen operations, accelerate modernisation and create meaningful business progress.
    - tablist "Service pillars":
      - tab "Cloud Services" [selected]
      - tab "Digital Transformation"
      - tab "Data & AI Services"
    - tabpanel "Cloud Services":
      - img "Cloud computing icons over a modern office building"
      - paragraph: Cloud that Scales your Organisation
      - paragraph: Adamas Tech Consulting helps enterprises, institutions, and public-sector organizations design modern cloud foundations, optimize operations, and apply AI on AWS for measurable business outcomes.
      - list:
        - listitem:
          - link "Migration & Modernization":
            - /url: /services/cloud-services/migration-modernization
        - listitem:
          - link "DevOps & SecOps":
            - /url: /services/cloud-services/devops-secops
        - listitem:
          - link "Managed Services":
            - /url: /services/cloud-services/managed-services
        - listitem:
          - link "AI/ML Ops":
            - /url: /services/cloud-services/ai-ml-ops
        - listitem:
          - link "Cloud Automation":
            - /url: /services/cloud-services/cloud-automation
        - listitem:
          - link "Cloud Advisory & Consultation":
            - /url: /services/cloud-services/cloud-advisory-consultation
      - link "Explore Cloud Services":
        - /url: /services/cloud-services
  - region "Purpose-Built Solutions for Complex Business Needs":
    - paragraph: Products & Solutions
    - heading "Purpose-Built Solutions for Complex Business Needs" [level=2]
    - paragraph: Focused platforms and accelerators designed around practical operational needs.
    - link "All solutions":
      - /url: /solutions
    - group "solutions controls":
      - button "Previous solutions"
      - paragraph: 01 / 06
      - button "Next solutions"
    - article:
      - img "Students and a lecturer talking around a laptop"
      - text: Product
      - heading "Arivoo" [level=3]:
        - link "Arivoo":
          - /url: https://arivoo.in
      - paragraph: Shaping the Future of Education.
      - list:
        - listitem:
          - link "Arivoo UMS":
            - /url: https://arivoo.in/arivoo-ums
        - listitem:
          - link "Arivoo SMS":
            - /url: https://arivoo.in/arivoo-sms
        - listitem:
          - link "Arivoo LMS":
            - /url: https://arivoo.in/arivoo-lms
      - paragraph: Visit site
    - article:
      - img "An analyst reviewing dashboards on a monitor"
      - text: Product
      - heading "A-EYE" [level=3]:
        - link "A-EYE":
          - /url: /solutions/a-eye
      - paragraph: Explore
    - article:
      - img "A woman reviewing analytics on a large screen"
      - text: Product
      - heading "AIR-MIND" [level=3]:
        - link "AIR-MIND":
          - /url: /solutions/air-mind
      - paragraph: Explore
    - article:
      - img "Face recognition illustration"
      - text: AI solution
      - heading "Face Recognition Security" [level=3]:
        - link "Face Recognition Security":
          - /url: /solutions/face-recognition
      - paragraph: Effortless Security through AI Recognition
      - paragraph: Explore
    - article:
      - img "Industrial analytics illustration"
      - text: AI solution
      - heading "Industrial Analytics" [level=3]:
        - link "Industrial Analytics":
          - /url: /solutions/industrial-analytics
      - paragraph: Effortless Parking with AI Intelligence
      - paragraph: Explore
    - article:
      - img "Businessman holding banknotes"
      - text: AI solution
      - heading "Asset Tracking" [level=3]:
        - link "Asset Tracking":
          - /url: /solutions/asset-tracking
      - paragraph: Boosting Cash Forecasting by 30%
      - paragraph: Explore
  - region "Real Challenges. Meaningful Transformation.":
    - paragraph: Client Outcomes
    - heading "Real Challenges. Meaningful Transformation." [level=2]
    - list:
      - listitem:
        - article:
          - paragraph: Education Technology
          - heading "Connecting the entire learning journey through Arivoo." [level=3]
          - paragraph: One digital ecosystem for academic and administrative experiences.
          - link "Read Case Study":
            - /url: /solutions/arivoo
  - region "Industry Growth":
    - navigation "Industries":
      - paragraph: All Industries
      - list:
        - listitem:
          - link "Healthcare":
            - /url: "#industry-healthcare"
        - listitem:
          - link "Financial Services":
            - /url: "#industry-financial-services"
        - listitem:
          - link "Retail":
            - /url: "#industry-retail"
        - listitem:
          - link "Education":
            - /url: "#industry-education"
    - paragraph: Industries
    - heading "Industry Growth" [level=2]
    - paragraph: We deliver smart technology solutions that help businesses improve efficiency, simplify operations, and grow faster.
    - article:
      - heading "Healthcare" [level=3]
      - paragraph: We help healthcare providers improve patient care and manage hospital operations with smart digital solutions.
      - paragraph: Our technology helps organize patient records, simplify daily tasks, and keep healthcare data secure.
      - 'link "Explore Industry : Healthcare"':
        - /url: /contact
    - article:
      - heading "Financial Services" [level=3]
      - paragraph: We help banks, financial institutions, and financial service providers improve their operations with reliable digital solutions.
      - paragraph: Our technology helps protect financial data, simplify transactions, manage information, and deliver better customer experiences.
      - 'link "Explore Industry : Financial Services"':
        - /url: /contact
    - article:
      - heading "Retail" [level=3]
      - paragraph: Drive growth in the retail and e-commerce sector with scalable platforms that support online storefronts, personalized marketing, inventory management, and CRM integration.
      - paragraph: Our solutions enhance customer experience, streamline operations, and provide actionable insights for data-driven decision-making.
      - 'link "Explore Industry : Retail"':
        - /url: /contact
    - article:
      - heading "Education" [level=3]
      - paragraph: Empower educational institutions with advanced Learning Management Systems (LMS), University Management Systems (UMS), and School Management Systems (SMS).
      - paragraph: Our solutions streamline operations, enhance student engagement, and support digital learning, ensuring an efficient and engaging educational experience.
      - 'link "Explore Industry : Education"':
        - /url: /contact
    - button "Previous industry" [disabled]
    - button "Next industry"
  - region "Why Organisations Choose Adamas":
    - paragraph: The Adamas Difference
    - heading "Why Organisations Choose Adamas" [level=2]
    - paragraph: One connected delivery ecosystem
    - list:
      - listitem:
        - heading "Enterprise technology expertise" [level=3]
        - paragraph: Practical expertise across complex enterprise technology environments.
      - listitem:
        - heading "End-to-end transformation" [level=3]
        - paragraph: Connected thinking from strategy and design through implementation and evolution.
      - listitem:
        - heading "Cloud, SAP and AI expertise" [level=3]
        - paragraph: Capabilities aligned to modern enterprise transformation priorities.
      - listitem:
        - heading "Strategic consulting" [level=3]
        - paragraph: Technology direction grounded in business context and operational needs.
      - listitem:
        - heading "Quality-focused delivery" [level=3]
        - paragraph: Structured delivery with a consistent focus on quality.
      - listitem:
        - heading "International presence" [level=3]
        - paragraph: Cross-market perspective supported by technology delivery capability.
  - region "Connect With Ideas That Shape Tomorrow":
    - paragraph: Events & Insights
    - heading "Connect With Ideas That Shape Tomorrow" [level=2]
    - list:
      - listitem:
        - paragraph: Insight · Trusted Cloud
        - heading "Building data sovereignty into your cloud strategy" [level=3]
        - link "Read Insight":
          - /url: /insights
      - listitem:
        - paragraph: Point of View · Enterprise AI
        - heading "Where agentic workflows can create practical value" [level=3]
        - link "Read Insight":
          - /url: /insights
      - listitem:
        - paragraph: Tech Discussion · Resilience
        - heading "Modernisation without compromising operational continuity" [level=3]
        - link "Explore Discussion":
          - /url: /insights
  - region "Latest Perspectives & Updates":
    - paragraph: Top Stories
    - heading "Latest Perspectives & Updates" [level=2]
    - article:
      - img "Floating charts and dashboards illustration"
      - paragraph: Data Intelligence · Publication date pending
      - heading "Turning trusted enterprise data into sharper business decisions." [level=3]
      - paragraph: A practical perspective on governance, forecasting and decision intelligence.
      - 'link "Read More : Turning trusted enterprise data into sharper business decisions."':
        - /url: /insights
    - article:
      - img "A padlock on a server illustration"
      - paragraph: Digital Resilience
      - heading "Modernising critical systems with security built in" [level=3]
      - 'link "Read More : Modernising critical systems with security built in"':
        - /url: /insights
    - article:
      - paragraph: Enterprise AI · Date pending
      - heading "Responsible AI starts with the right operating model." [level=3]
      - paragraph: Principles for moving from isolated experiments to measurable business outcomes.
      - 'link "Read More : Responsible AI starts with the right operating model."':
        - /url: /insights
  - region "Develop Innovations That Propel Your Business":
    - paragraph: Tech Excellence
    - heading "Develop Innovations That Propel Your Business" [level=2]
    - list:
      - listitem:
        - article:
          - heading "Customized Solutions" [level=3]
          - paragraph: A client-centric approach that emphasizes collaboration, understanding goals, and creating custom solutions for growth.
      - listitem:
        - article:
          - heading "Proven Expertise" [level=3]
          - paragraph: Extensive experience across multiple sectors, delivering tailored solutions that drive measurable results.
      - listitem:
        - article:
          - heading "Certified Quality" [level=3]
          - paragraph: ISO 9001, ISO 27001 certified, and CMMI Level 3, ensuring top standards of quality, security, and compliance.
          - list "Certifications":
            - listitem:
              - img "BSI ISO 9001:2015 Quality Management certification badge"
            - listitem:
              - img "DQS ISO/IEC 27001 Information Security certification badge"
            - listitem:
              - img "CMMI Maturity Level 3 appraised badge"
      - listitem:
        - article:
          - heading "Comprehensive Services" [level=3]
          - paragraph: Offering full-cycle support from consultation to deployment, ensuring seamless integration and long-term success.
  - region "Explore our global presence around the world":
    - paragraph: Our Presence
    - heading "Explore our global presence around the world" [level=2]
    - list:
      - listitem:
        - article:
          - paragraph: Your nearest office
          - heading "Bengaluru" [level=3]
          - text: 27th Main Rd, 1st Sector HSR Layout, Bengaluru Karnataka 560102
      - listitem:
        - article:
          - paragraph: United Kingdom
          - heading "London" [level=3]
          - text: Golden Cross House 8 Duncannon Street London WC2N 4JF
          - link "+44 7768 706988":
            - /url: tel:+447768706988
      - listitem:
        - article:
          - paragraph: United States
          - heading "Palo Alto" [level=3]
          - text: 530 Lytton Avenue, 2nd Floor Palo Alto, CA 94301
      - listitem:
        - article:
          - paragraph: United Arab Emirates
          - heading "Dubai" [level=3]
          - text: B-2101, 1601 & 801 Latifa Tower near Trade Centre, Sheikh Zayed Road Dubai, UAE
          - link "+971 4 705 6001":
            - /url: tel:+97147056001
      - listitem:
        - article:
          - paragraph: India
          - heading "Kolkata" [level=3]
          - text: Haute Street, Topsia Road Kolkata, West Bengal 700046
  - region "Let's Talk About Business Solutions With Us":
    - img "Three colleagues talking over coffee"
    - paragraph: Do you have any question?
    - heading "Let's Talk About Business Solutions With Us" [level=2]
    - text: Full Name
    - textbox "Full Name": <img src=x onerror="document.title='pwned'">
    - text: Your Email
    - textbox "Your Email" [invalid]: bad
    - paragraph: Enter an email address in the correct format, like name@company.com.
    - text: Your Phone Country
    - combobox "Country":
      - option "India (+91)" [selected]
      - option "United Kingdom (+44)"
      - option "Ireland (+353)"
      - option "United Arab Emirates (+971)"
      - option "Saudi Arabia (+966)"
      - option "Qatar (+974)"
      - option "Kuwait (+965)"
      - option "Bahrain (+973)"
      - option "Oman (+968)"
      - option "United States (+1)"
      - option "Other"
    - textbox "Your Phone"
    - text: What's your Project about?
    - textbox "What's your Project about?" [invalid]: x
    - paragraph: Enter a message of at least 10 characters.
    - checkbox "I agree to the Privacy Policy and Terms of Use."
    - text: I agree to the
    - link "Privacy Policy":
      - /url: /privacy-policy
    - text: and
    - link "Terms of Use":
      - /url: /terms-of-use
    - text: .
    - button "Submit Now!"
- contentinfo:
  - link "AdamasTech Consulting, India homepage":
    - /url: /in/
  - list:
    - listitem:
      - paragraph: India
      - link "+91-6296680677":
        - /url: tel:+916296680677
      - link "marketing@adamastech.in":
        - /url: mailto:marketing@adamastech.in
    - listitem:
      - paragraph: UK & Ireland
      - link "+44 7768 706988":
        - /url: tel:+447768706988
      - link "marketing@adamastech.in":
        - /url: mailto:marketing@adamastech.in
    - listitem:
      - paragraph: GCC
      - link "+971 4 705 6001":
        - /url: tel:+97147056001
      - link "marketing@adamastech.in":
        - /url: mailto:marketing@adamastech.in
  - navigation "Footer":
    - heading "Company" [level=2]
    - list:
      - listitem:
        - link "About Us":
          - /url: /about
      - listitem:
        - link "Team":
          - /url: /about/team
      - listitem:
        - link "Case Studies":
          - /url: /case-studies
      - listitem:
        - link "Credentials":
          - /url: /credentials
      - listitem:
        - link "Contact":
          - /url: /contact
    - heading "Services" [level=2]
    - list:
      - listitem:
        - link "Cloud Services":
          - /url: /services/cloud-services
      - listitem:
        - link "Digital Transformation":
          - /url: /services/digital-transformation
      - listitem:
        - link "Data & AI Services":
          - /url: /services/ai-services
      - listitem:
        - link "Services overview":
          - /url: /services
    - heading "Solutions" [level=2]
    - list:
      - listitem:
        - link "Arivoo":
          - /url: https://arivoo.in
      - listitem:
        - link "Face Recognition Security":
          - /url: /solutions/face-recognition
      - listitem:
        - link "Industrial Analytics":
          - /url: /solutions/industrial-analytics
      - listitem:
        - link "Asset Tracking":
          - /url: /solutions/asset-tracking
      - listitem:
        - link "TestGUARD":
          - /url: https://arivoo.in/testguard
      - listitem:
        - link "All solutions":
          - /url: /solutions
    - heading "Insights" [level=2]
    - list:
      - listitem:
        - link "Events":
          - /url: /insights/events
      - listitem: Blog (coming soon)
  - region "Our offices":
    - heading "Our offices" [level=2]
    - list:
      - listitem:
        - paragraph: London
        - text: Golden Cross House 8 Duncannon Street London WC2N 4JF
        - link "+44 7768 706988":
          - /url: tel:+447768706988
      - listitem:
        - paragraph: Palo Alto
        - text: 530 Lytton Avenue, 2nd Floor Palo Alto, CA 94301
      - listitem:
        - paragraph: Dubai
        - text: B-2101, 1601 & 801 Latifa Tower near Trade Centre, Sheikh Zayed Road Dubai, UAE
        - link "+971 4 705 6001":
          - /url: tel:+97147056001
      - listitem:
        - paragraph: Bengaluru
        - text: 27th Main Rd, 1st Sector HSR Layout, Bengaluru Karnataka 560102
      - listitem:
        - paragraph: Kolkata
        - text: Haute Street, Topsia Road Kolkata, West Bengal 700046
  - paragraph: © 2026 AdamasTech Consulting
  - list "Legal":
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy-policy
    - listitem:
      - link "Cookie Policy":
        - /url: /cookie-policy
    - listitem:
      - link "Terms of Use":
        - /url: /terms-of-use
    - listitem:
      - link "Credentials":
        - /url: /credentials
  - list "Social media":
    - listitem:
      - link "Facebook":
        - /url: https://www.facebook.com/AdamasTechConsulting/
    - listitem:
      - link "LinkedIn":
        - /url: https://www.linkedin.com/company/adamas-tech-consulting/
  - group: India
- alert
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { cleanupForms, countContactRows, disconnectDb, testEmail, visibleEventPath } from "./helpers";
  3   | 
  4   | /** Contact form (homepage) and event registration: validation, honeypot, double submit, success, country selector. */
  5   | 
  6   | test.afterAll(async () => {
  7   |   await cleanupForms();
  8   |   await disconnectDb();
  9   | });
  10  | 
  11  | async function fillContact(page: Page, v: { name?: string; email?: string; phone?: string; message?: string; consent?: boolean }) {
  12  |   const f = page.locator('[data-compare="contact"] form');
  13  |   if (v.name !== undefined) await f.locator('input[name="name"]').fill(v.name);
  14  |   if (v.email !== undefined) await f.locator('input[name="email"]').fill(v.email);
  15  |   if (v.phone !== undefined) await f.locator('input[name="phone"]').fill(v.phone);
  16  |   if (v.message !== undefined) await f.locator('textarea[name="message"]').fill(v.message);
  17  |   if (v.consent) await f.locator('input[name="consent"]').check({ force: true });
  18  |   return f;
  19  | }
  20  | 
  21  | test.describe("contact form", () => {
  22  |   test("required fields and formats are validated inline and on submit", async ({ page }) => {
  23  |     await page.goto("/in/");
  24  |     const f = await fillContact(page, {});
  25  |     await f.locator('button[type="submit"]').click();
  26  |     await expect(f.locator("[role='status']")).toContainText(/problem/i);
  27  |     expect(await f.locator("[aria-invalid='true']").count()).toBeGreaterThanOrEqual(3);
  28  |     await f.locator('input[name="email"]').fill("not-an-email");
  29  |     await f.locator('input[name="email"]').blur();
  30  |     await expect(f.locator('input[name="email"]')).toHaveAttribute("aria-invalid", "true");
  31  |     const describedBy = await f.locator('input[name="email"]').getAttribute("aria-describedby");
  32  |     expect(describedBy).toBeTruthy();
  33  |   });
  34  | 
  35  |   test("the phone country selector defaults to the region, is labelled and shows a focus ring (BUG-009)", async ({ page }) => {
  36  |     await page.goto("/gcc/");
  37  |     const select = page.locator('[data-compare="contact"] select[name="country"]');
  38  |     expect(await select.inputValue()).toBe("United Arab Emirates");
  39  |     expect(await select.getAttribute("aria-label")).toBeTruthy();
  40  |     await select.focus();
  41  |     await page.keyboard.press("Tab");
  42  |     await page.keyboard.press("Shift+Tab");
  43  |     await expect(select).toBeFocused();
  44  |     const ring = await page.evaluate(() => {
  45  |       const s = document.querySelector('[data-compare="contact"] select[name="country"]') as HTMLElement;
  46  |       const box = s.nextElementSibling as HTMLElement;
  47  |       const cs = getComputedStyle(box);
  48  |       return { width: cs.outlineWidth, style: cs.outlineStyle };
  49  |     });
  50  |     expect(ring.style).not.toBe("none");
  51  |     expect(parseFloat(ring.width)).toBeGreaterThanOrEqual(2);
  52  |   });
  53  | 
  54  |   test("the honeypot stores nothing and answers as if it worked", async ({ page }) => {
  55  |     await page.goto("/in/");
  56  |     const email = testEmail("honeypot");
  57  |     const f = await fillContact(page, { name: "E2E Bot", email, phone: "+919999999999", message: "Honeypot test", consent: true });
  58  |     await f.locator('input[name="company_website"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
  59  |     await f.locator('button[type="submit"]').click();
  60  |     await expect(page).toHaveURL(/\/thank-you/);
  61  |     const rows = await countContactRows(email);
  62  |     if (rows >= 0) expect(rows).toBe(0);
  63  |   });
  64  | 
  65  |   test("a valid submission saves one row and lands on the thank-you page; double submit saves one", async ({ page }) => {
  66  |     await page.goto("/uk/");
  67  |     const email = testEmail("contact");
  68  |     const f = await fillContact(page, { name: "E2E Person", email, phone: "+447700900000", message: "Regression test message, please ignore.", consent: true });
  69  |     const button = f.locator('button[type="submit"]');
  70  |     await button.click();
  71  |     await button.click({ force: true, trial: false }).catch(() => {});
  72  |     await expect(page).toHaveURL(/\/thank-you/, { timeout: 15000 });
  73  |     await expect(page.locator("h1:visible")).toHaveCount(1);
  74  |     const rows = await countContactRows(email);
  75  |     if (rows >= 0) expect(rows).toBe(1);
  76  |   });
  77  | 
  78  |   test("HTML in a field is escaped where it is shown back", async ({ page }) => {
  79  |     await page.goto("/in/");
  80  |     const payload = `<img src=x onerror="document.title='pwned'">`;
  81  |     const f = await fillContact(page, { name: payload, email: "bad", message: "x" });
  82  |     await f.locator('button[type="submit"]').click();
> 83  |     await expect(f.locator("[role='status']")).toContainText(/problem/i);
      |                                                ^ Error: expect(locator).toContainText(expected) failed
  84  |     expect(await f.locator('input[name="name"]').inputValue()).toBe(payload);
  85  |     expect(await page.title()).not.toContain("pwned");
  86  |     expect(await page.locator("img[src='x']").count()).toBe(0);
  87  |   });
  88  | });
  89  | 
  90  | test.describe("event registration", () => {
  91  |   test("registers once, refuses a duplicate, validates fields", async ({ page }) => {
  92  |     const path = await visibleEventPath(page);
  93  |     test.skip(!path, "no visible event in this configuration");
  94  |     await page.goto(path!);
  95  |     const form = page.locator("form#register");
  96  |     if ((await form.count()) === 0) {
  97  |       await expect(page.locator("[role='status']")).toBeVisible();
  98  |       return; // registration closed: the closed state renders instead of the form
  99  |     }
  100 |     await form.locator('button[type="submit"]').click();
  101 |     await expect(form.locator("[role='alert'], [role='status']").first()).toBeVisible();
  102 |     expect(await form.locator("[aria-invalid='true']").count()).toBeGreaterThanOrEqual(2);
  103 | 
  104 |     const email = testEmail("register");
  105 |     await form.locator('input[name="name"]').fill("E2E Attendee");
  106 |     await form.locator('input[name="email"]').fill(email);
  107 |     const company = form.locator('input[name="company"]');
  108 |     if (await company.count()) await company.fill("E2E Ltd");
  109 |     await form.locator('input[name="consent"]').check({ force: true });
  110 |     await form.locator('button[type="submit"]').click();
  111 |     await expect(page.locator("text=/registration received|you are registered|confirmed/i").first()).toBeVisible({ timeout: 15000 });
  112 | 
  113 |     await page.goto(path!);
  114 |     await form.locator('input[name="name"]').fill("E2E Attendee");
  115 |     await form.locator('input[name="email"]').fill(email.toUpperCase());
  116 |     if (await company.count()) await company.fill("E2E Ltd");
  117 |     await form.locator('input[name="consent"]').check({ force: true });
  118 |     await form.locator('button[type="submit"]').click();
  119 |     await expect(page.locator("text=/already registered/i").first()).toBeVisible({ timeout: 15000 });
  120 |   });
  121 | 
  122 |   test("the calendar file is served as text/calendar", async ({ page }) => {
  123 |     const path = await visibleEventPath(page);
  124 |     test.skip(!path, "no visible event in this configuration");
  125 |     const res = await page.request.get(`${path}/calendar`);
  126 |     expect(res.status()).toBe(200);
  127 |     expect(res.headers()["content-type"]).toContain("text/calendar");
  128 |     const body = await res.text();
  129 |     expect(body).toContain("BEGIN:VCALENDAR");
  130 |     expect(body).toContain("BEGIN:VEVENT");
  131 |   });
  132 | });
  133 | 
```