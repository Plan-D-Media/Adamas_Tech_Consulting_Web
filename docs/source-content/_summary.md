# AdamasTech Consulting: source-content summary

- Fetched: 2026-10-29, via `curl` of the server HTML (no JavaScript run). Base: https://adamastechconsulting.com
- One file per URL in this folder: `<slug>.md`, with nested paths flattened using `__`, e.g. `case-study__case-study_kubernetes.md`. Header and footer are in `_global.md`, and the raw dump of them is in `_global_raw.md`.
- **Visibility markers in the page files.** The site is built with Elementor and the "Synck" ThemeForest theme by wordpressriver. Many pages still contain demo-template sections that never show on the live site. In the files, `[RESPONSIVE: hidden on desktop, tablet, mobile -- start] … [-- end]` marks a section Elementor hides on every device, and `[HIDDEN (display:none …)]` marks an inline `display:none` block. **Ignore text inside these markers when migrating.** It includes "Bluebase", "Mandro", "+1 455 1482 236", "16/9, Down Street Edinburgh", "720/5, Starc Street, North View, New York" and demo team members such as Jennifer Linda.
- No page has a `<meta name="description">`. Only `og:description` exists, and Yoast auto-generates it from the first body text. It is recorded per page.

---

## 1. Homepage diff (/in/ vs /uk/ vs /ae/)

`/` returns a 301 to `/in`. The header and footer are identical on all three regional pages (see `_global.md`). The region switcher label reads "India" even on /uk/ and /ae/.

### /in/ vs /uk/
**The extracted text is identical.** The only differences:
- `<title>`/og:title: "In - Adamas Tech : IT consultancy and solutions" vs "UK - Adamas Tech : IT consultancy and solutions"
- Canonical URL is /in/ vs /uk/.
- Contact-form internal ID (p13363 vs p13366) and the random captcha question.

The UK page has no UK-specific headline, phone, office order, CTA or section. Both pages show the same offices, phones, email (marketing@adamastech.in), hero slides and Vimeo IDs.

### /ae/ vs /in/, section by section
| Section | /in/ and /uk/ | /ae/ |
|---|---|---|
| `<title>` | In / UK - Adamas Tech : IT consultancy and solutions | "Ae - Adamas Tech : IT consultancy and solutions" |
| og:image | /2026/03/Image-_Right.webp | /2026/04/Frame-1000005061-1.png |
| Hero slider | 4 slides: ATC, AWS, Oracle, SAP | **3 slides: ATC, Oracle, SAP. The AWS slide is removed.** Poster images are local uploads (`/2026/05/Img-1.png`, `Img_2.png`, `Img_3.png`) instead of Vimeo CDN thumbnails. The Smart Slider Vimeo `background` flag is 1 on AE and 0 on IN/UK. |
| Partner strip heading | `## Our Proud / Partners` heading, then image Image-_Right.webp (AWS Partner + SAP PartnerEdge + Oracle NetSuite badge banner) | No text heading. Image Frame-1000005061-1.png is a badge reading "Our Proud Partners" with SAP PartnerEdge and Oracle NetSuite only, **no AWS**. |
| Client logo strip ("View All" -> /clients) | 15 logos: 1-scaled … 14, plus pi_square (see section 3) | 11 logos: 1, 2, 3, 6, 10, 12, 13, plus Emirates, Rain Stella Technologies, KOA, Avenue Professional Document Clearing LLC. A hidden "View All Clients" button is also present. |
| **AE-only section: UAE e-invoicing banner** | — | "- Deadline approaching: July 2026" / `## UAE E-Invoicing Is Coming. Be Ready Before the Deadline.` / "We seamlessly convert your unstructured invoices—PDFs, paper, and legacy exports—into the FTA-mandated structured digital format, routing them directly through our approved ASP partners for instant compliance." / three badges: "Built for UAE" + `## VAT compliance`, "Works with any" + `## ERP system`, "Secure &" + `## Enterprise-ready` / buttons **"Learn More"** -> https://adamastechconsulting.com/e-invoicing-uae and **"Take Assesment"** [sic] -> https://adamastech.ae/assessment/ (external domain) / image /2026/04/unnamed-file.png |
| Services: heading | `##### OUR SERVICES` / `# Driving Growth Through Innovative Solutions` / same intro / "View All" -> /services/ | Same |
| Services card 1 | `### SAP Services`: "We handle implementation to optimization, aligning your enterprise systems with strategic goals for optimal performance." Bullets: Streamline Operations, Data Driven Insights | `### SAP Services`: "Enterprise SAP solutions for UAE organizations seeking better control, visibility, and operational efficiency." Bullets: Process optimization, Unified operations |
| Services card 2 | `### AWS Services` -> /aws-solutions/: "Harness advanced AWS services in AI, automation, and cloud to drive digital transformation, efficiency, and scalable growth across your business." Bullets: Eliminate Tech Debt with Q Developer, Scalable Hosting on AWS EC2 | **`### Oracle NetSuite Services`** -> /oracle-netsuite-solutions: "Cloud ERP solutions for UAE businesses focused on agility, financial visibility, and scalable growth." Bullets: Cloud ERP, Financial visibility. Image `/2026/04/Screenshot-2026-04-19-at-3.35.51 PM-2.png` |
| Services card 3 | `## AI/ML Services`: "Automate processes to enhance efficiency and reduce operational costs." | `## AI/ML Services`: "AI solutions that automate workflows, improve decisions, and unlock measurable business value." |
| Services card 4 | `## Oracle NetSuite Services`: "Unified Cloud ERP for Modern Construction" | **`## Mobile App Development`**: "Mobile apps designed for seamless customer experiences, workforce productivity, and digital engagement." **No link.** Image /2026/05/mobile-app.png |
| Services card 5 | `## Open edX services`: "Custom development and services for scalable and engaging learning experiences." | "Digital learning platforms for institutions and enterprises across the UAE and wider region." |
| Services card 6 | `## Technology Transformation`: "Enhance efficiency, agility, and scalability in operations by optimize, and transform digitally." | "Modernize legacy systems and accelerate digital transformation across operations, platforms, and customer experiences." |
| Success Stories | 4 cards (see section 4) | Identical |
| PARTNERS & CERTIFICATIONS | Visible (12 logos) | **Hidden on all devices.** Two hidden copies exist: one with 2024 PNGs including docker.png, one with the 2026 webp set. |
| Industries | Visible | Visible, identical |
| TECH EXCELLENCE | Visible | **Hidden on all devices** |
| Hidden demo sections | — | AE carries further all-device-hidden blocks: "Discover Arivoo: Shaping the Future of Education." (product tabs with Arivoo SMS/LMS/UMS/TestGuard copy), a long contact form, "INNOVATION … 3+ Years Experience / Meet Our Experts", "How we do", "CONSULTING EXCELLENCE", "INTERESTING ARTICLES" (theme demo news), "FEATURED PRODUCT … Download Slack", and a demo "We have branches all over the world" block (New York ×6, +1 455 1482 236). None of it is visible. |
| Contact section | `##### Contact` / `# Lets get in touch` / "You can reach us anytime via marketing@adamastech.in" / form | Identical |
| Our Presence | London, San Francisco, Dubai, Bengaluru, Kolkata (same text) | Identical. The AE page does not put Dubai first. |
| Hidden stats (`display:none`) | 22+ Years / 950+ Projects / 99% / 1995+ Year / 2 Mins | Identical (hidden) |

---

## 2. Hero slides (Smart Slider 3; Vimeo IDs from `FrontendItemVimeo` JSON `vimeocode`)

On every slide, the CTA is the label **"Let’s Talk"** (curly apostrophe) -> `https://adamastechconsulting.com/contact` (no trailing slash). Autoplay = 1 and on end = "next".

### /in/ and /uk/ (identical, slider `n2-ss-2`)
| # | data-title | Small label | Headline (H2) | Sub-copy | Vimeo ID | Poster |
|---|---|---|---|---|---|---|
| 1 | ATC | ATC | "Seeking Digital Transformation ?" (line break after "Digital", space before "?") | Separate words/lines: "AI/ML Solutions", "AWS Services", "SAP Solutions", "Technology Transformation" | **1143398275** | i.vimeocdn.com/video/2091573100-…-d_1280 |
| 2 | AWS | AWS | "Scale Smarter. Build Faster. On AWS." | "From cloud migration to AI automation, we help you optimize workloads, boost performance, and drive profitable growth with AWS-certified capabilities." | **1177633889** | i.vimeocdn.com/video/2139010267-…-d_1280 |
| 3 | Oracle | Oracle | "Transform Operations with Oracle NetSuite" | "As an Oracle NetSuite Partner, we help enterprises replace fragmented systems with a unified, cloud-native ERP built for growth and governance." | **1150026207** | i.vimeocdn.com/video/2100809217-…-d_1280 |
| 4 | SAP | SAP | "Reinvent SAP for the Digital Era" | "Modernize legacy systems, integrate business functions, and deliver smarter workflows with our end-to-end SAP transformation services." | **1142019553** | i.vimeocdn.com/video/2089628651-…-d_1280 |

### /ae/ (slider `n2-ss-3`)
| # | Headline | Vimeo ID | Poster |
|---|---|---|---|
| 1 | "Seeking Digital Transformation ?" (same sub-copy as IN) | **1143398275** | https://adamastechconsulting.com/wp-content/uploads/2026/05/Img-1.png |
| 2 | "Transform Operations with Oracle NetSuite" (same sub-copy) | **1150026207** | …/2026/05/Img_2.png |
| 3 | "Reinvent SAP for the Digital Era" (same sub-copy) | **1142019553** | …/2026/05/Img_3.png |

Full poster URLs are in `in.md` and `ae.md`. Every slide also contains a leftover `<source src="https://adamastechconsulting.com/wp-content/uploads/2025/09/watermarked_preview.mp4">` inside a `<p>` with no `<video>` parent. It plays nothing and can be ignored. Other Vimeo occurrences: `test-page` (1143398275 via player.vimeo.com/video/1143398275?h=e632306fa8), `smart-slider-page` (1143398275), `about-us-backup` (1142019553), `home-new` and `home-old-1` (same 4 as /in/). No YouTube embeds were found anywhere.

---

## 3. Partners and certification logos

### "PARTNERS & CERTIFICATIONS / Trusted Partners & Certified Excellence" (visible on /in/ and /uk/, hidden on /ae/)
Copy: "Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project." All images have alt="". I identified each name by viewing the image.
| # | Name | Image URL |
|---|---|---|
| 1 | AWS | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-3161.webp |
| 2 | SAP | https://adamastechconsulting.com/wp-content/uploads/2026/03/SAP-Logo.svg.webp |
| 3 | Oracle NetSuite | https://adamastechconsulting.com/wp-content/uploads/2026/03/Oracle_NetSuite_2021.webp |
| 4 | MigNow | https://adamastechconsulting.com/wp-content/uploads/2026/03/mignow.webp |
| 5 | Leapwork | https://adamastechconsulting.com/wp-content/uploads/2026/03/Partner.webp |
| 6 | Flipkart | https://adamastechconsulting.com/wp-content/uploads/2026/03/flipkart.webp |
| 7 | techUK | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-3159.webp |
| 8 | LCCI (London Chamber of Commerce & Industry) | https://adamastechconsulting.com/wp-content/uploads/2026/03/LCCI-1.webp |
| 9 | Open edX | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-3160.webp |
| 10 | BSI ISO 9001:2015 Quality Management | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-31601.webp |
| 11 | DQS ISO/IEC 27001 Information Security | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-31591.webp |
| 12 | CMMI ML3 Appraised | https://adamastechconsulting.com/wp-content/uploads/2026/03/Frame-31621-1.webp |

The hidden AE copy uses /2024/10 and /2024/12 PNG versions and adds **docker.png** (`/2024/12/docker.png`). It has no SAP, Oracle or MigNow logos.

A second partner list (theme PNGs) sits inside the homepage, contact, about and clients "Partners" widget: `/wp-content/themes/synck-child/assets/images/` aws.png, SAP-Logo.svg.png, Oracle_NetSuite_2021.png, mignow.png, Partner.png, Flip.png, techUK.png, LCCI-1.png, openEdx.png.

### Homepage client strip (visible; "View All" -> /clients)
- /in/ and /uk/, uploads/2026/03/: Image-_Right.webp (AWS Partner Advanced Tier Services + SAP PartnerEdge + Oracle NetSuite badge), 1-scaled (PwC), 2-scaled (Careem), 3-scaled (United Foods), 4-scaled-e1774249821356 (white-on-transparent hexagon logo, name not legible), 5-scaled (WorkIndia), 6 (Aldar Commercial Kitchen), 7-scaled (Infocom, An ABP initiative), 8-scaled (Webel), 9-e1774249746732 (white emblem, not legible), 10-scaled (Gulf Processing Industries LLC), 11-scaled (Navneet), 12-scaled (Ajmal), 13-scaled (NCGR), 14-e1774249906517 (white seal, not legible), pi_square_technologies_cover@1.5x-1 (Pi-Square Technologies LLC · USA).
- /ae/: Frame-1000005061-1.png ("Our Proud Partners" with SAP PartnerEdge and Oracle NetSuite), then 1, 2, 3, 6, 10, 12, 13 as above, then uploads/2026/05/: Emirates-_logo_grey-and-whote-1.png (Emirates bottled drinking water, "Since 1979"), logo-2-1.png (Rain Stella Technologies), Logo_3-1.png (KOA), 1_Logo-1-1.png (Avenue Professional Document Clearing LLC).
- The /clients page has tabs **India** (16 logos), **UAE** (10) and **Others** (4). The file names and alts are in `clients.md`. A further 19 logos (2025/05–07 `Frame-30xx.png`) sit in a block hidden on all devices.

---

## 4. Success stories and case studies

### Homepage "Success Stories" (identical on /in/, /uk/, /ae/)
`##### Success Stories` / `# Results- Driven projects that deliver excellence` [sic, "Results- Driven"] / "Discover the remarkable projects that highlight our innovation, expertise, and commitment to delivering excellence." / hidden tab "Managed Services and Products" / "View All" -> /case-studies/
| Card title (H2, verbatim) | Links to | Image |
|---|---|---|
| Effortless Security through AI Recognition | /face-recognition | /2026/03/2a-1.webp |
| Effortless Parking with AI Intelligence | /car-parking-lot | /2026/03/1a.webp |
| Boosting Cash Forecasting by 30% | /sap-treasury-investment-and-cash-management-implementation | /2026/03/2-2.webp |
| Reducing Cost in Liquor Manufacturing | /sap-analytics-cloud-implementation | /2026/03/Card-1-case-studies.webp |

### /case-studies/ listing (`case-studies.md`)
Heading: `##### Success Stories` / `# Real-World Tech Solutions Driving Your Business Success` / "Discover how innovative AI-powered tech solutions are transforming industries, enhancing efficiency, and unlocking new opportunities."

| Label | Title (verbatim) | Metric | Detail page (its H1 and label) | og:image of detail page |
|---|---|---|---|---|
| FINANCIAL AUTOMATION | Reduced Invoice Processing Time by 90% with AI Automation. | 90% | /invoiceai-automated-invoice-processing-reconciliation ("InvoiceAI – Automated Invoice Processing & Reconciliation") | /2025/12/Gen-AI-Case-1-01.png |
| KNOWLEDGE MANAGEMENT | Instant Knowledge Retrieval with AI-Powered RAG Chatbot. | 50% Less Support Load | /information-retriever-chatbot-enterprise-knowledge-assistant | /2025/12/Gen-AI-Case-2-01.png |
| LIQUOR | Accelerate Decision-Making by 30% with Real-Time Dashboard Insights. | 30% | /sap-analytics-cloud-implementation (label "Liquor") | /2024/09/Frame-2801.png |
| AUTOMOBILE | Cut Manual Reconciliation Efforts and Costs by 60% Instantly. | 60% | /sap-treasury-investment-and-cash-management-implementation (label "**Manufacturing**") | /2024/09/Frame-2617.png |
| FINANCIAL PRODUCTIVITY | 80% Faster Period Closure: Reduce Reporting Time to 2 Days. | 80%; "8-10 days to just 2-3 days" | /sap-inter-company-reconciliation-functionalities (label "Real Estate") | /2024/09/Frame-2818.png |
| BANKING | Achieve 70% Faster Batch Processing for Enhanced Operational Efficiency. | 70% | /sap-bank-communication-management (label "Real Estate") | /2024/09/Frame-2809.png |
| WORKFLOW MANAGEMENT | Reduced Data Volume by 97% for Optimal Storage Efficiency. | 97%; body says "cutting storage needs by three-quarters" | /sap-s4hana-business-partners-creation-with-workflow-management-functionalities | /2024/09/Frame-2845.png |
| PREDICTIVE MAINTAINANCE [sic] | Boosted Sales Revenue by 15% in Just One Year. | 15% | /condition-contract-management-settlement-management (label "Consumer Packaged Goods") | /2024/09/Frame-2865.png |
| PHARMA | Reduce Manual Efforts by 50% with Better Planning and Insights. | 50% | /proactive-and-predictive-machine-health-monitoring-with-iot-integration-solution (label "Manufacturing") | /2024/09/Frame-2874.png |
| RESOURCE PLANNING | Save 30% in Efforts with Smarter Resource Planning. | 30% | /sap-fiori-and-btp-cloud-solution-for-capex-project-management-tool-for-real-estate (label "Manufacturing") | /2024/09/Frame-2883.png |
| MANUFACTURING | Detect 80% of steel plate defects with advanced computer vision algorithms. | 80% | /advanced-steel-plate-inspection | /2024/08/Frame-2617-1.png |
| SMART CITIES | Real-Time Parking Spot Detection with 95% Accuracy. | 95% | /car-parking-lot | /2024/08/Frame-2617-2.png |
| retail [lower-case on site] | 95% Accurate Fruit Detection with Advanced Computer Vision Algorithms | 95% | /fruit-recognition | /2024/08/Frame-2617-3.png |
| SMART CITIES | 99% Accurate Real-Time Facial Recognition Across Multiple Individuals. | 99% | /face-recognition | /2024/08/Frame-2617-4.png |
| SMART CITIES | AI Ensures 95%+ PPE Compliance with 30% Efficiency Boost | 95%+, 30% | /ppe-detection | /2024/08/Frame-2637.png |
| SMART CITIES | 95% Accurate Real-Time Cinema Analytics with Advanced Computer Vision | 95% | /cinema-hall-person-count | /2024/08/Frame-2651.png |
| Retail | Monitor Crowd Flow with 98.7% Accuracy and 24/7 Real-Time Entry/Exit tracking. | 98.7% | /entry-exit-time-tracker-monitoring-ingress-and-egress-activity | /2024/09/Frame-3082-1.png |
| SMART CITIES | AI Smarter Spaces: Analyzing traffic with 99% accuracy, improving flow by 30% | 99%, 30% | /surveillance-system ("AI Smarter Spaces - Traffic Monitoring") | /2024/08/Frame-2699.png |

Each card's body text and its 4 bullet points are in `case-studies.md`. Each detail page's full body (Business Overview / Challenge / Solutions Offered / Technologies Leveraged / Business Benefits with stats) is in that page's file. For example, the SAP Treasury page shows the stats **30%** "Improvement in cash forecasting accuracy", **20%** "Decrease in DSO … and DPO", **60%** "Reduction in manual reconciliation efforts and operational costs" and **99%** "Faster reporting (from 8 hours to 5 seconds)".

**Case-study pages in the sitemap but not on the listing:** /ai-smarter-spaces-traffic-monitoring (a duplicate of the surveillance-system title), /crowd-movement (its H1 and image duplicate face-recognition: "Enhancing Security: A Case Study in Advanced Face Recognition"), /furniture-similarity ("Furniture Match: AI-Driven Furniture Recognition and Matching System"), /sap-advanced-available-to-promise-solution-implementation, /sap-finance-group-consolidation ("Financial Group Consolidations with SAP BPC and BW HANA Technology Solutions"), /sap-finance-supply-chain-management, /sap-fiori-based-mobility-application-for-supply-chain-and-logistics, /transforming-higher-education-with-aws-cloud, /resilient-backup-recovery-with-aws, and two `case-study` custom-post-type pages:
- /case-study/case-study_kubernetes/: "Modernizing Kubernetes Operations for a Leading HealthTech Company" (HealthTech; AWS Managed Services; Amazon EKS, CloudWatch, Grafana); image /2026/09/Frame-1000005153-2.png
- /case-study/case-study_sap_cement-industry/: "Strengthening SAP Resilience and Disaster Recovery on AWS" (Leading Manufacturing Cement Company; AWS Managed Services; SAP HANA Replication, CloudWatch, AWS Backup); image /2026/09/Rectangle.png

---

## 5. Industries, Tech Excellence and stats (verbatim, from /in/)

### Industries
`##### Industries` / `# Empowering growth in diverse industries`
Tabs: Education · Retail · Healthcare · Finance · Hospitality · Supply chain · Public sector
- `# Education Technology Solutions`: "Empower educational institutions with advanced Learning Management Systems (LMS), University Management Systems (UMS), and School Management Systems (SMS). Our solutions streamline operations, enhance student engagement, and support digital learning, ensuring an efficient and engaging educational experience."
- `# Retail and E-Commerce Platforms`: "Drive growth in the retail and e-commerce sector with scalable platforms that support online storefronts, personalized marketing, inventory management, and CRM integration. Our solutions enhance customer experience, streamline operations, and provide actionable insights for data-driven decision-making."
- `# Healthcare Management Systems`: "Revolutionize healthcare delivery with robust management systems designed for hospitals, clinics, and healthcare providers. Our solutions enhance patient engagement, streamline operations, and support data-driven decision-making, ensuring efficient and high-quality healthcare services."
- `# Financial Services Automation`: "Optimize financial operations with solutions that streamline processes, improve compliance, and enhance customer engagement. Our services include automated workflows, advanced analytics, and secure data management, enabling financial institutions to operate efficiently and adapt to changing market dynamics."
- `# Hospitality and Tourism Management`: "Enhance guest experiences and streamline operations with our tailored solutions for the hospitality and tourism industry. Our offerings include booking platforms, guest management systems, and loyalty programs, all designed to boost customer satisfaction and drive business growth."
- `# Manufacturing and Supply Chain Optimization`: "Increase efficiency and productivity in manufacturing with solutions that optimize supply chain management, production planning, and inventory control. Our technology-driven approach enhances operational efficiency, reduces costs, and supports data-driven decision-making across the supply chain."
- `# Public Sector and Government Solutions`: "Transform public services with digital solutions that enhance transparency, improve citizen engagement, and streamline processes. Our offerings include e-governance platforms, data management systems, and analytics solutions, all designed to support effective and efficient government operations."

The tab labels ("Supply chain") and panel titles ("Manufacturing and Supply Chain Optimization") differ.

### Tech Excellence (visible on /in/ and /uk/, hidden on /ae/)
`##### TECH EXCELLENCE` / `# Develop Innovations That Propel Your Business`
- `### Customized Solutions`: "A client-centric approach that emphasizes collaboration, understanding goals, and creating custom solutions for growth."
- `### Proven Expertise`: "Extensive experience across multiple sectors, delivering tailored solutions that drive measurable results."
- `### Certified Quality`: "ISO 9001, ISO 27001 certified, and CMMI Level 3, ensuring top standards of quality, security, and compliance."
- `### Comprehensive Services`: "Offering full-cycle support from consultation to deployment, ensuring seamless integration and long-term success."
- Image: /2026/03/tech-Excellence-1.webp (alt="Iphone")

### About Us "WHY CHOOSE US" (`about-us.md`)
`# Your Trusted Partner in Technology Innovation` / "We deliver custom solutions that are tailored to your unique needs, ensuring efficiency and scalability."
Tailored Solutions · Expert Team · End-to-End Services · Innovative Approach · Agile Methodology · Customer-Centric (each one-liner is in the file).

### Stats
| Figure | Label | Where | Visible? |
|---|---|---|---|
| 5 Mins | Response Time | Footer CTA band (every page) | Yes |
| 99% | Client Satisfaction | Footer (every page) | Yes |
| 26.8k Hours | Field Experience | Footer (every page) | Yes |
| 22+ Years | Field Experience | Homepages, contact, about-us, clients, services ("Partners" widget) | **No** (`display:none`) |
| 950+ Projects | Done Around World | Same | No |
| 99% | Client Satisfaction | Same | No |
| 1995+ Year | Established On | Same | No |
| 2 Mins | Response Time | Same | No |
| "over 100 experts" | team size | /about-us/ body | Yes |
| "Founded in 2021" | founding year | /about-us/ body (and a hidden copy on /clients/) | Yes |
| 3+ Years Experience | — | /ae/ hidden demo block | No |
| 1995 / "We Established On" | — | /company/, /about-us-backup/ (theme demo pages) | Yes, but on demo pages |

---

## 6. Offices

### "Our Presence" block (`##### Our Presence`, map-icon.svg)
Identical on /in/, /uk/ and /ae/, with tel links on the homepages, contact and about-us.

| Label shown | Address exactly as shown (line breaks = " / ") | Phone |
|---|---|---|
| **London** | Golden Cross House / 8 Duncannon Street / London WC2N 4JF | Tel: +44 7768 706988 (tel:+44 7768 706988) |
| **San Francisco** | 530, Lytton Avenue, 2nd / Floor, Palo Alto, 94301 | none |
| **Dubai** | B-2101, 1601 & 801 Latifa Tower near Trade Centre, Sheikh Zayed Road, Dubai, UAE. | Tel: +971 4 705 6001 |
| **Bengaluru** | 27th Main Rd, 1st Sector, / HSR Layout, Bengaluru, / Karnataka, 560102 | none |
| **Kolkata** | Haute Street, Topsia / Road, Kolkata, West / Bengal 700046 | none |

Where it appears:
- /in/, /uk/, /ae/: all 5 offices with both tel numbers.
- /about-us/ and /contact/: all 5, but Dubai reads "B-2101, 1601 & 801 Latifa Tower, Sheikh Zayed Road, Dubai" (no "near Trade Centre", no "UAE.") and London is on one line, "Golden Cross House 8 Duncannon Street London WC2N 4JF". Both tel numbers are shown.
- /services/ and /clients/: all 5 with the long Dubai text, but **no Tel lines**.
- The Palo Alto office is labelled "San Francisco" everywhere in this block.

### Second office list on /contact/ only (visible)
| Label | Address |
|---|---|
| San Francisco, USA | 530, Lytton Avenue, 2nd Floor, Palo Alto, California |
| London, UK | 39 Roxborough Road, Harrow, London |
| Kolkata, India | Haute Street, 86 A, Topsia Road, |
| Bangalore, India | 27th Main Rd, 1st Sector, HSR Layout |
| Riyadh, Saudi Arabia | Riyadh |
| Bhubaneswar, India | Arch Bishop House, Saheed nagar, Khurda |

Then `#### Support` "Contact our fast support team" marketing@adamastech.in · `#### Phone` "Mon-Fri from 9:30am to 6:30pm." **+91-6296680677**
Then `##### Locations` / `# Explore our global presence around the world` / "Our location is strategically situated at the heart of City, making it an ideal destination for businesses and visitors alike." / #1 Bengaluru India, #2 Kolkata India, #3 Bhubaneswar India, #4 San Francisco California, #5 Riyadh Saudi Arabia, #6 London United Kingdom. **Dubai is not in this list.**

### Legal addresses
- Terms of use: "Adamas Tech Consulting Private Limited … registered in India at 2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068, India." Phone "6296680677", email info@adamastech.in / Info@adamastech.in.
- Privacy policy postal address: "Adamas Tech Consulting / 2nd Floor, Vallabha Pamadi, 2727, / 16th Cross, 27th Main Rd, HSR layout / Bengaluru, Karnataka 560068 / India". UK representative: **Arun Bardhan**, arun.bardhan@adamastech.co.uk, "39 Roxborough Road / Harrow, London HA1 1NS / England".
- /cybersecurity/ (not in the nav): "Bengaluru · London · California · Riyadh · Dubai".

---

## 7. Contact details and form fields per page

**Global (header and footer, every page):** tel:+91-6296680677 (header icon), "Mobile +91-6296680677", "Mail marketing@adamastech.in", Facebook, LinkedIn.

| Page | Visible email | Visible phones in body | Visible form |
|---|---|---|---|
| /in/, /uk/, /ae/ | marketing@adamastech.in ("You can reach us anytime via …") | +44 7768 706988, +971 4 705 6001 | Form A |
| /about-us/ | marketing@adamastech.in | +44 7768 706988, +971 4 705 6001 | Form A |
| /contact/ | marketing@adamastech.in (×2) | +44 7768 706988, +971 4 705 6001, +91-6296680677 | Form A |
| /services/, /clients/ | marketing@adamastech.in | none | Form A |
| /e-invoicing-uae/ | none | none | Form B |
| /privacy-policy/ | Info@adamastech.in, hr@adamastech.in, arun.bardhan@adamastech.co.uk | none | none (links to a Termly DSAR form) |
| /terms-of-use/ | Info@adamastech.in / info@adamastech.in | 6296680677 | none |
| /consulting/ and all service pages (sap-solution-consulting, ai-data-analytics, openedx, aws-solutions, aws-solutions-old, technology-transformation, application-development, cloud-transformation, master-data-governance, data-science-analytics, oracle-netsuite-solutions, sap-treasury…) | none visible | none | **none visible.** These pages contain only hidden theme forms and demo contact info (bluebase@mail.com / +1 455 1482 236). |

**Form A** (Contact Form 7 id 313, used on the homepages, contact, about-us, services and clients):
- Section: `##### Contact` / `# Lets get in touch` [sic, no apostrophe]
- Name (text, `first_name`, placeholder "Name")
- Email (email, placeholder "Your Email")
- Phone Number (tel, `phone_number`, placeholder "Your Number")
- Country (text, placeholder "Your Country")
- Message (textarea, placeholder "Leave us a message....")
- Acceptance checkbox: "You agree to our terms and conditions." (link -> /terms-of-use)
- Math captcha: "Please enter an answer in digits:" with a random question (All-In-One WP Security)
- Submit: "Get Started"

**Form B** (CF7 id 11439, /e-invoicing-uae/, `### Talk to an E-Invoicing Expert` "Tailored guidance for CFOs & Tax Consultants."):
- Full name (placeholder "Ahmed Al-Mansoori")
- Work email ("ahmed@company.ae")
- Phone: UAE flag image, ext field ("+971"), phone ("XX XXX XXXX")
- Company name ("ABC Trading LLC")
- Existing ERP System (no placeholder)
- Math captcha
- Submit value: "Schedule Free Consultation"
- Other CTAs on the page: "Start Free Assesment" [sic] -> https://adamastech.ae/assessment/ and "Book a scoping call" -> #form

**Form C** (CF7 id 1031, the long theme form) is **hidden on all devices** wherever it appears (contact, about-us, ae). Its fields: Name\*, Email\*, Phone Number\*, Country\*, company type radio (SAAS/Banking/Agency/Business/Other), service checkboxes (App Dev., SAP Solution, AI/ML Service, Web Dev., Cloud service, Other), Message, Budget range slider ("$200k"), terms/privacy acceptance, captcha, honeypot.

---

## 8. Conflicts and inconsistencies

**Company age and experience**
- "Founded in 2021" (/about-us/, visible) vs "1995+ Year / Established On" (hidden stats on the homepages, about-us, contact, services and clients) vs "1995 / We Established On" (demo pages /company/ and /about-us-backup/).
- "22+ Years / Field Experience" (hidden, same pages) vs "26.8k Hours / Field Experience" (footer, visible on every page) vs "3+ Years Experience" (/ae/ hidden).

**Response time**
- "5 Mins / Response Time" (footer, visible everywhere) vs "2 Mins / Response Time" (hidden stats block on the homepages, about-us, contact, services and clients).

**Countries and offices**
- About Us: "expanded its presence across four countries: Saudi Arabia, England, the USA, and India". This omits the UAE, yet Dubai is shown as an office, there is a whole /ae/ region and a UAE e-invoicing practice.
- Palo Alto address (530 Lytton Avenue, Palo Alto, 94301) is labelled "San Francisco" in Our Presence and "San Francisco, USA" / "San Francisco, California" on /contact/.
- London has two addresses: "Golden Cross House, 8 Duncannon Street, London WC2N 4JF" (Our Presence) vs "39 Roxborough Road, Harrow, London" (/contact/ second list; also the privacy-policy UK rep address, HA1 1NS).
- Bengaluru has two postcodes and addresses: "27th Main Rd, 1st Sector, HSR Layout, Bengaluru, Karnataka, 560102" (Our Presence) vs "2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068" (terms and privacy). The contact page also spells it "Bangalore, India".
- Kolkata: "Haute Street, Topsia Road, Kolkata, West Bengal 700046" vs "Haute Street, 86 A, Topsia Road," (contact second list, trailing comma).
- Dubai: "…Latifa Tower near Trade Centre, Sheikh Zayed Road, Dubai, UAE." (homepages, services, clients) vs "…Latifa Tower, Sheikh Zayed Road, Dubai" (about-us, contact).
- Riyadh and Bhubaneswar appear only on /contact/ (second list and Locations). Dubai is missing from the /contact/ Locations list.

**Phones and emails**
- India phone is written "+91-6296680677" (header, footer, contact) vs "6296680677" (terms of use).
- Email is marketing@adamastech.in on every contact surface, but the privacy policy uses Info@adamastech.in and hr@adamastech.in, and the terms use info@adamastech.in. The UK rep uses the adamastech.co.uk domain, and the AE assessment uses the **adamastech.ae** domain.
- No UK phone number exists other than the London mobile +44 7768 706988. There is no US phone.

**Regional pages**
- /uk/ is a duplicate of /in/. Every region shows the same India phone in the header and footer, and the region switcher always reads "India".

**Arivoo links**
- Header mega menu uses arivoo.in/lms and arivoo.in/sms, with no link for UMS ("Coming soon"). The footer uses arivoo.in/arivoo-lms, /arivoo-sms and /arivoo-ums. TestGUARD is arivoo.in/testguard in both.

**Footer and services listings**
- The footer Services list labels a link "AWS Solutions Old" (-> /aws-solutions-old/), while the header links to /aws-solutions/.
- The /services/ page gives AWS Solutions the description "Drive innovation with strategic technology transformation", which is a copy of the Technology Transformation card's text.
- Homepage Oracle card: "Unified Cloud ERP for Modern Construction". This is construction-specific, unlike the other cards.

**Case-study labels and links**
- /sap-treasury… is "Boosting Cash Forecasting by 30%" on the homepage, "Cut Manual Reconciliation Efforts and Costs by 60% Instantly." with the label "AUTOMOBILE" on /case-studies/, and labelled "Manufacturing" on its own page.
- /sap-analytics-cloud-implementation is "Reducing Cost in Liquor Manufacturing" on the homepage and "Accelerate Decision-Making by 30%…" on /case-studies/.
- Other label mismatches: condition-contract page is labelled "PREDICTIVE MAINTAINANCE" on the listing but "Consumer Packaged Goods" on its page; machine-health page is "PHARMA" vs "Manufacturing"; CAPEX real-estate page is "RESOURCE PLANNING" vs "Manufacturing".
- The Entry/Exit and AI Smarter Spaces listing cards reuse the PPE card's body text and bullets ("Real-time monitoring detects non-compliance within seconds…").
- Duplicate pages: /surveillance-system and /ai-smarter-spaces-traffic-monitoring share the H1 "AI Smarter Spaces - Traffic Monitoring". /crowd-movement duplicates /face-recognition's H1.
- Workflow card: "Reduced Data Volume by 97%" vs body "cutting storage needs by three-quarters".

**Visible theme leftovers**
- /sap-treasury… and /openedx show a visible theme pricing block: `##### OUR PRICING` / "Our affordable pricing plans" / "30/year" / "Premium package" / "30 Days Free Trail" [sic]. Please check this in a browser.

**Typos (kept verbatim in the files)**
- "Results- Driven" (homepages)
- "Lets get in touch" (all Form A sections)
- "Take Assesment" (/ae/)
- "Start Free Assesment" (/e-invoicing-uae/)
- "PREDICTIVE MAINTAINANCE"
- "retail" in lower case (/case-studies/)
- "Seeking Digital Transformation ?" (space before "?")
- "by optimize, and transform digitally" (Technology Transformation card)
- "Middle east" (header)
- "MSAP S4 HANA" (sap-treasury Technologies)
- "30 Days Free Trail"
- "Need any further assitance?" (hidden)
- "Brainstroming" (demo how-we-do)
- "4o" (stray characters after a stat on /data-science-analytics/)
- Sign conventions on "Did you know?" stats, e.g. "-86%" for "Eighty-six percent see data analytics as a competitive edge" and "-23%" on SAP. These are in the respective files.
- "Open edX services" in lower case on homepage cards vs "Open edX® Platform Services" elsewhere.

---

## 9. Full list of old URLs from the sitemap

The sitemap index is https://adamastechconsulting.com/sitemap_index.xml (Yoast). `/wp-sitemap.xml` and `/sitemap.xml` both redirect to it. It lists 10 sub-sitemaps: post, page, elementor-hf, atc-blog, case-study, category, post_tag, blog-categories, casestudy-categories and author. That gives **121 URLs**, listed below.

- Every URL returned HTTP 200 except four that redirect: `/` (301 -> /in), and the three `/elementor-hf/*` URLs (301 -> / -> /in/).
- The extra URLs I probed, `/house-of-lords/` and `/success-stories/`, return **404**. Their files hold only the failure note.
- Many sitemap pages are Synck theme demo content: /our-pricing, /new-releases, /event-single, /events, /our-field-details, /how-we-do(-single), /portfolio(-detail), /company, /features, /solutions, /faq, /overview, /home-version1-2-2, /home-version2, /blog, /blogs, /blog-with-sidebar, /consulted-admitting-is-power-acuteness(-2,-3), /tag/*, /category/*, /atcblog/*, /casestudy/*. Some backup and old pages are also live: /home-old, /home-old-1, /home-new, /home-6, /clients-old, /services-backup, /case-studies-backup, /about-us-backup, /aws-solutions-old, /test-page, /smart-slider-page. They all still need 301 targets.

#### post-sitemap.xml
- https://adamastechconsulting.com/blog-with-sidebar/ — HTTP 200 — file: `blog-with-sidebar.md`
- https://adamastechconsulting.com/consulted-admitting-is-power-acuteness/ — HTTP 200 — file: `consulted-admitting-is-power-acuteness.md`
- https://adamastechconsulting.com/consulted-admitting-is-power-acuteness-2/ — HTTP 200 — file: `consulted-admitting-is-power-acuteness-2.md`
- https://adamastechconsulting.com/consulted-admitting-is-power-acuteness-3/ — HTTP 200 — file: `consulted-admitting-is-power-acuteness-3.md`
#### page-sitemap.xml
- https://adamastechconsulting.com/ — redirects (301) to https://adamastechconsulting.com/in/ — no separate file (content = `in.md`)
- https://adamastechconsulting.com/our-pricing/ — HTTP 200 — file: `our-pricing.md`
- https://adamastechconsulting.com/new-releases/ — HTTP 200 — file: `new-releases.md`
- https://adamastechconsulting.com/event-single/ — HTTP 200 — file: `event-single.md`
- https://adamastechconsulting.com/our-field-details/ — HTTP 200 — file: `our-field-details.md`
- https://adamastechconsulting.com/how-we-do-single/ — HTTP 200 — file: `how-we-do-single.md`
- https://adamastechconsulting.com/portfolio-detail/ — HTTP 200 — file: `portfolio-detail.md`
- https://adamastechconsulting.com/company/ — HTTP 200 — file: `company.md`
- https://adamastechconsulting.com/portfolio/ — HTTP 200 — file: `portfolio.md`
- https://adamastechconsulting.com/features/ — HTTP 200 — file: `features.md`
- https://adamastechconsulting.com/solutions/ — HTTP 200 — file: `solutions.md`
- https://adamastechconsulting.com/events/ — HTTP 200 — file: `events.md`
- https://adamastechconsulting.com/faq/ — HTTP 200 — file: `faq.md`
- https://adamastechconsulting.com/overview/ — HTTP 200 — file: `overview.md`
- https://adamastechconsulting.com/home-version1-2-2/ — HTTP 200 — file: `home-version1-2-2.md`
- https://adamastechconsulting.com/home-version2/ — HTTP 200 — file: `home-version2.md`
- https://adamastechconsulting.com/ai-smarter-spaces-traffic-monitoring/ — HTTP 200 — file: `ai-smarter-spaces-traffic-monitoring.md`
- https://adamastechconsulting.com/sap-fiori-based-mobility-application-for-supply-chain-and-logistics/ — HTTP 200 — file: `sap-fiori-based-mobility-application-for-supply-chain-and-logistics.md`
- https://adamastechconsulting.com/sap-advanced-available-to-promise-solution-implementation/ — HTTP 200 — file: `sap-advanced-available-to-promise-solution-implementation.md`
- https://adamastechconsulting.com/sap-finance-group-consolidation/ — HTTP 200 — file: `sap-finance-group-consolidation.md`
- https://adamastechconsulting.com/sap-finance-supply-chain-management/ — HTTP 200 — file: `sap-finance-supply-chain-management.md`
- https://adamastechconsulting.com/how-we-do/ — HTTP 200 — file: `how-we-do.md`
- https://adamastechconsulting.com/terms-of-use/ — HTTP 200 — file: `terms-of-use.md`
- https://adamastechconsulting.com/privacy-policy/ — HTTP 200 — file: `privacy-policy.md`
- https://adamastechconsulting.com/furniture-similarity/ — HTTP 200 — file: `furniture-similarity.md`
- https://adamastechconsulting.com/services-backup/ — HTTP 200 — file: `services-backup.md`
- https://adamastechconsulting.com/case-studies-backup/ — HTTP 200 — file: `case-studies-backup.md`
- https://adamastechconsulting.com/entry-exit-time-tracker-monitoring-ingress-and-egress-activity/ — HTTP 200 — file: `entry-exit-time-tracker-monitoring-ingress-and-egress-activity.md`
- https://adamastechconsulting.com/openedx/ — HTTP 200 — file: `openedx.md`
- https://adamastechconsulting.com/ai-data-analytics/ — HTTP 200 — file: `ai-data-analytics.md`
- https://adamastechconsulting.com/technology-transformation/ — HTTP 200 — file: `technology-transformation.md`
- https://adamastechconsulting.com/application-development/ — HTTP 200 — file: `application-development.md`
- https://adamastechconsulting.com/data-science-analytics/ — HTTP 200 — file: `data-science-analytics.md`
- https://adamastechconsulting.com/intelligent-automation/ — HTTP 200 — file: `intelligent-automation.md`
- https://adamastechconsulting.com/sap-s4hana-business-partners-creation-with-workflow-management-functionalities/ — HTTP 200 — file: `sap-s4hana-business-partners-creation-with-workflow-management-functionalities.md`
- https://adamastechconsulting.com/master-data-governance/ — HTTP 200 — file: `master-data-governance.md`
- https://adamastechconsulting.com/crowd-movement/ — HTTP 200 — file: `crowd-movement.md`
- https://adamastechconsulting.com/sap-solution-consulting/ — HTTP 200 — file: `sap-solution-consulting.md`
- https://adamastechconsulting.com/sap-analytics-cloud-implementation/ — HTTP 200 — file: `sap-analytics-cloud-implementation.md`
- https://adamastechconsulting.com/sap-treasury-investment-and-cash-management-implementation/ — HTTP 200 — file: `sap-treasury-investment-and-cash-management-implementation.md`
- https://adamastechconsulting.com/sap-inter-company-reconciliation-functionalities/ — HTTP 200 — file: `sap-inter-company-reconciliation-functionalities.md`
- https://adamastechconsulting.com/sap-bank-communication-management/ — HTTP 200 — file: `sap-bank-communication-management.md`
- https://adamastechconsulting.com/condition-contract-management-settlement-management/ — HTTP 200 — file: `condition-contract-management-settlement-management.md`
- https://adamastechconsulting.com/proactive-and-predictive-machine-health-monitoring-with-iot-integration-solution/ — HTTP 200 — file: `proactive-and-predictive-machine-health-monitoring-with-iot-integration-solution.md`
- https://adamastechconsulting.com/sap-fiori-and-btp-cloud-solution-for-capex-project-management-tool-for-real-estate/ — HTTP 200 — file: `sap-fiori-and-btp-cloud-solution-for-capex-project-management-tool-for-real-estate.md`
- https://adamastechconsulting.com/car-parking-lot/ — HTTP 200 — file: `car-parking-lot.md`
- https://adamastechconsulting.com/fruit-recognition/ — HTTP 200 — file: `fruit-recognition.md`
- https://adamastechconsulting.com/advanced-steel-plate-inspection/ — HTTP 200 — file: `advanced-steel-plate-inspection.md`
- https://adamastechconsulting.com/face-recognition/ — HTTP 200 — file: `face-recognition.md`
- https://adamastechconsulting.com/ppe-detection/ — HTTP 200 — file: `ppe-detection.md`
- https://adamastechconsulting.com/cinema-hall-person-count/ — HTTP 200 — file: `cinema-hall-person-count.md`
- https://adamastechconsulting.com/surveillance-system/ — HTTP 200 — file: `surveillance-system.md`
- https://adamastechconsulting.com/blog/ — HTTP 200 — file: `blog.md`
- https://adamastechconsulting.com/blogs/ — HTTP 200 — file: `blogs.md`
- https://adamastechconsulting.com/aws-for-ec2-hosting/ — HTTP 200 — file: `aws-for-ec2-hosting.md`
- https://adamastechconsulting.com/services/ — HTTP 200 — file: `services.md`
- https://adamastechconsulting.com/home-6/ — HTTP 200 — file: `home-6.md`
- https://adamastechconsulting.com/consulting/ — HTTP 200 — file: `consulting.md`
- https://adamastechconsulting.com/clients-old/ — HTTP 200 — file: `clients-old.md`
- https://adamastechconsulting.com/transforming-higher-education-with-aws-cloud/ — HTTP 200 — file: `transforming-higher-education-with-aws-cloud.md`
- https://adamastechconsulting.com/resilient-backup-recovery-with-aws/ — HTTP 200 — file: `resilient-backup-recovery-with-aws.md`
- https://adamastechconsulting.com/aws-for-reducing-tech-debt/ — HTTP 200 — file: `aws-for-reducing-tech-debt.md`
- https://adamastechconsulting.com/aws-for-operational-insights/ — HTTP 200 — file: `aws-for-operational-insights.md`
- https://adamastechconsulting.com/aws-for-generative-ai/ — HTTP 200 — file: `aws-for-generative-ai.md`
- https://adamastechconsulting.com/aws-for-automated-workflows/ — HTTP 200 — file: `aws-for-automated-workflows.md`
- https://adamastechconsulting.com/contact/ — HTTP 200 — file: `contact.md`
- https://adamastechconsulting.com/clients/ — HTTP 200 — file: `clients.md`
- https://adamastechconsulting.com/home-old/ — HTTP 200 — file: `home-old.md`
- https://adamastechconsulting.com/home-new/ — HTTP 200 — file: `home-new.md`
- https://adamastechconsulting.com/home-old-1/ — HTTP 200 — file: `home-old-1.md`
- https://adamastechconsulting.com/invoiceai-automated-invoice-processing-reconciliation/ — HTTP 200 — file: `invoiceai-automated-invoice-processing-reconciliation.md`
- https://adamastechconsulting.com/case-studies/ — HTTP 200 — file: `case-studies.md`
- https://adamastechconsulting.com/information-retriever-chatbot-enterprise-knowledge-assistant/ — HTTP 200 — file: `information-retriever-chatbot-enterprise-knowledge-assistant.md`
- https://adamastechconsulting.com/oracle-netsuite-solutions/ — HTTP 200 — file: `oracle-netsuite-solutions.md`
- https://adamastechconsulting.com/about-us-backup/ — HTTP 200 — file: `about-us-backup.md`
- https://adamastechconsulting.com/smart-slider-page/ — HTTP 200 — file: `smart-slider-page.md`
- https://adamastechconsulting.com/ae/ — HTTP 200 — file: `ae.md`
- https://adamastechconsulting.com/cybersecurity/ — HTTP 200 — file: `cybersecurity.md`
- https://adamastechconsulting.com/e-invoicing-uae/ — HTTP 200 — file: `e-invoicing-uae.md`
- https://adamastechconsulting.com/test-page/ — HTTP 200 — file: `test-page.md`
- https://adamastechconsulting.com/about-us/ — HTTP 200 — file: `about-us.md`
- https://adamastechconsulting.com/atc-blog/ — HTTP 200 — file: `atc-blog.md`
- https://adamastechconsulting.com/aws-solutions-old/ — HTTP 200 — file: `aws-solutions-old.md`
- https://adamastechconsulting.com/in/ — HTTP 200 — file: `in.md`
- https://adamastechconsulting.com/uk/ — HTTP 200 — file: `uk.md`
- https://adamastechconsulting.com/outgrowing-your-accounting-software/ — HTTP 200 — file: `outgrowing-your-accounting-software.md`
- https://adamastechconsulting.com/sap-ecc-end-of-life/ — HTTP 200 — file: `sap-ecc-end-of-life.md`
- https://adamastechconsulting.com/aws-managed-services/ — HTTP 200 — file: `aws-managed-services.md`
- https://adamastechconsulting.com/cloud-transformation/ — HTTP 200 — file: `cloud-transformation.md`
- https://adamastechconsulting.com/cloud-migration-modernisation/ — HTTP 200 — file: `cloud-migration-modernisation.md`
- https://adamastechconsulting.com/managed-cloud-optimization/ — HTTP 200 — file: `managed-cloud-optimization.md`
- https://adamastechconsulting.com/data-analytics/ — HTTP 200 — file: `data-analytics.md`
- https://adamastechconsulting.com/devops-automation/ — HTTP 200 — file: `devops-automation.md`
- https://adamastechconsulting.com/application-modernization/ — HTTP 200 — file: `application-modernization.md`
- https://adamastechconsulting.com/security-governance/ — HTTP 200 — file: `security-governance.md`
- https://adamastechconsulting.com/ai-ml-services/ — HTTP 200 — file: `ai-ml-services.md`
- https://adamastechconsulting.com/education-services/ — HTTP 200 — file: `education-services.md`
- https://adamastechconsulting.com/aws-solutions/ — HTTP 200 — file: `aws-solutions.md`
- https://adamastechconsulting.com/cloud-services/ — HTTP 200 — file: `cloud-services.md`
- https://adamastechconsulting.com/ai-value/ — HTTP 200 — file: `ai-value.md`
#### elementor-hf-sitemap.xml
- https://adamastechconsulting.com/elementor-hf/home-v2-header/ — redirects (301) to https://adamastechconsulting.com/in/ — no separate file (content = `in.md`)
- https://adamastechconsulting.com/elementor-hf/home-footer/ — redirects (301) to https://adamastechconsulting.com/in/ — no separate file (content = `in.md`)
- https://adamastechconsulting.com/elementor-hf/home-v1-header/ — redirects (301) to https://adamastechconsulting.com/in/ — no separate file (content = `in.md`)
#### atc-blog-sitemap.xml
- https://adamastechconsulting.com/atc-blog/the-transformative-power-of-ai-in-2024-key-trends-and-innovations-2/ — HTTP 200 — file: `atc-blog__the-transformative-power-of-ai-in-2024-key-trends-and-innovations-2.md`
- https://adamastechconsulting.com/atc-blog/openai-launches-new-alignment-division-to-tackle-risks-of-superintelligent-ai/ — HTTP 200 — file: `atc-blog__openai-launches-new-alignment-division-to-tackle-risks-of-superintelligent-ai.md`
- https://adamastechconsulting.com/atc-blog/the-transformative-power-of-ai-in-2024-key-trends-and-innovations/ — HTTP 200 — file: `atc-blog__the-transformative-power-of-ai-in-2024-key-trends-and-innovations.md`
#### case-study-sitemap.xml
- https://adamastechconsulting.com/case-study/case-study_kubernetes/ — HTTP 200 — file: `case-study__case-study_kubernetes.md`
- https://adamastechconsulting.com/case-study/case-study_sap_cement-industry/ — HTTP 200 — file: `case-study__case-study_sap_cement-industry.md`
#### category-sitemap.xml
- https://adamastechconsulting.com/category/uncategorized/ — HTTP 200 — file: `category__uncategorized.md`
#### post_tag-sitemap.xml
- https://adamastechconsulting.com/tag/development/ — HTTP 200 — file: `tag__development.md`
- https://adamastechconsulting.com/tag/saas/ — HTTP 200 — file: `tag__saas.md`
#### blog-categories-sitemap.xml
- https://adamastechconsulting.com/atcblog/analytics-including-sac/ — HTTP 200 — file: `atcblog__analytics-including-sac.md`
- https://adamastechconsulting.com/atcblog/machine-learning/ — HTTP 200 — file: `atcblog__machine-learning.md`
- https://adamastechconsulting.com/atcblog/web-development/ — HTTP 200 — file: `atcblog__web-development.md`
#### casestudy-categories-sitemap.xml
- https://adamastechconsulting.com/casestudy/healthcare/ — HTTP 200 — file: `casestudy__healthcare.md`
- https://adamastechconsulting.com/casestudy/manufacturing-cement/ — HTTP 200 — file: `casestudy__manufacturing-cement.md`
#### author-sitemap.xml
- https://adamastechconsulting.com/author/atc-usercontrol/ — HTTP 200 — file: `author__atc-usercontrol.md`

#### Probed, not in sitemap
- https://adamastechconsulting.com/house-of-lords/ — HTTP 404 — `house-of-lords.md`
- https://adamastechconsulting.com/success-stories/ — HTTP 404 — `success-stories.md`

---

## 10. Mentions: House of Lords, Arivoo, TestGUARD, RICE Adamas Group, team/leadership, e-invoicing

- **House of Lords:** no mention anywhere in the 121 sitemap pages (searched "House of Lords", "Lords", "Parliament", "Westminster"). /house-of-lords/ returns 404. There is no event page. /events and /event-single hold only theme demo events (e.g. "Strategies to expand your start up company by bluebase").
- **RICE Adamas Group:** no mention anywhere (searched "RICE Adamas" and the word "RICE").
- **Arivoo:** in the header Products mega menu and the footer Products column on every page (Arivoo LMS, Arivoo SMS, Arivoo UMS (Coming soon), TestGUARD; links in `_global.md`). The hidden /ae/ section "Discover Arivoo: Shaping the Future of Education." has product copy:
  - "Arivoo SMS optimizes school management by streamlining class schedules, teacher assignments, and student records. This powerful system enhances operational efficiency, providing a seamless experience for administrators, teachers, and students to support educational excellence." (-> https://arivoo.in/arivoo-sms)
  - "Arivoo LMS is a dynamic learning management system that enhances the educational experience with features like course management, online exams, and interactive content. Its customizable and user-friendly interface supports educators and students in achieving academic success." (-> https://arivoo.in/arivoo-lms)
  - "Arivoo UMS is an integrated university management system that simplifies student enrollment, administrative tasks, and data analytics. It provides higher education institutions with a comprehensive solution to efficiently manage resources and academic processes for improved outcomes." (-> https://arivoo.in/arivoo-ums)
  - "Arivoo TestGuard ensures exam integrity with AI-driven remote proctoring. It offers secure online assessments through live proctoring, identity verification, and real-time analytics, maintaining academic honesty and fairness in testing environments for institutions worldwide." (-> https://arivoo.in/testguard)
  - The same products also appear on the old/demo homepages (home-old, home-new, home-6, etc.).
- **TestGUARD:** written "TestGUARD" in the nav and footer, "Arivoo TestGUARD" in the hidden /ae/ tabs, and "Arivoo TestGuard" in the body copy. Header blurb: "Secure online exams, integrity ensured remotely."
- **Team / leadership (/about-us/, visible):** `##### LEADERSHIP` / `# Our Company Leading Members`
  - **Rajat Subhra Roy**, Director
  - **Saumya Subhra Roy**, Director
  - **KayCee (Koushik Chatterjee)**, Chief Executive Officer
  - Photos are in `about-us.md`.
  - Also: UK data-protection representative **Arun Bardhan** (privacy policy).
  - A hidden demo "Our professional experts" team (Jennifer Linda, Merlin Bullock, etc.) is not real.
- **E-invoicing:**
  - Full page /e-invoicing-uae/ (`e-invoicing-uae.md`): deadline "July 2026", ASP-appointment deadline "31 July 2026", "Cabinet Decision No. 106 of 2025", penalties "up to AED 5,000", pilot "July–December 2026", go-live "January 2027", 9 modular service segments with durations, the DCTCE 5-corner Peppol model, and Form B.
  - /ae/ homepage banner (section 1).
  - Header "UAE e-invoicing" and footer "UAE E-invoicing" links.
  - Related: /invoiceai-automated-invoice-processing-reconciliation (AI invoice processing case study, "90%").
