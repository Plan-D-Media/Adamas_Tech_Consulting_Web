# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: region.spec.ts >> bare / routing >> the region switcher sets the cookie and swaps the homepage
- Location: tests\e2e\region.spec.ts:62:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('summary[aria-label^=\'Region\']') resolved to 2 elements:
    1) <summary aria-label="Region: India. Change region" class="flex cursor-pointer select-none items-center gap-3 whitespace-nowrap font-ui transition-colors duration-(--duration-fast) h-10 rounded-sm px-3 text-[0.875rem] text-black hover:bg-white/60">…</summary> aka getByRole('banner').getByLabel('Region: India. Change region')
    2) <summary aria-label="Region: India. Change region" class="flex cursor-pointer select-none items-center gap-3 whitespace-nowrap font-ui transition-colors duration-(--duration-fast) h-11 rounded-xs border border-navy-700 px-3 text-[0.875rem] font-semibold text-white hover:border-grey-300">…</summary> aka getByRole('contentinfo').getByLabel('Region: India. Change region')

Call log:
  - waiting for locator('summary[aria-label^=\'Region\']')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - link "Call Us +91-6296680677" [ref=e7] [cursor=pointer]:
            - /url: tel:+916296680677
          - link "marketing@adamastech.in" [ref=e11] [cursor=pointer]:
            - /url: mailto:marketing@adamastech.in
        - list "Social media" [ref=e16]:
          - listitem [ref=e17]:
            - link "Facebook (opens in a new tab)" [ref=e18] [cursor=pointer]:
              - /url: https://www.facebook.com/AdamasTechConsulting/
          - listitem [ref=e21]:
            - link "LinkedIn (opens in a new tab)" [ref=e22] [cursor=pointer]:
              - /url: https://www.linkedin.com/company/adamas-tech-consulting/
      - generic [ref=e25]:
        - link "AdamasTech Consulting, India homepage" [ref=e26] [cursor=pointer]:
          - /url: /in/
        - navigation "Main" [ref=e28]:
          - list [ref=e29]:
            - listitem [ref=e30]:
              - button "About Us" [ref=e31]
            - listitem [ref=e34]:
              - button "Services" [ref=e35]
            - listitem [ref=e38]:
              - button "Solutions" [ref=e39]
            - listitem [ref=e42]:
              - link "Case Studies" [ref=e43] [cursor=pointer]:
                - /url: /case-studies
            - listitem [ref=e44]:
              - button "Insights" [ref=e45]
        - generic [ref=e48]:
          - group [ref=e50]:
            - 'generic "Region: India. Change region" [ref=e51] [cursor=pointer]': India
          - link "Talk to an expert" [ref=e57] [cursor=pointer]:
            - /url: /contact
  - main [ref=e60]:
    - generic [ref=e62]:
      - region [ref=e63]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - paragraph [ref=e68]: India Engineering Delivery Center · Kolkata & Pan-India
            - heading "Powering Enterprise Excellence With Cloud, SAP & AI" [level=1] [ref=e69]
            - paragraph [ref=e70]: Accelerating digital sovereignty, automated e-invoicing compliance, and mission-critical cloud modernization for governments and top enterprises across India.
            - generic [ref=e71]:
              - link "Talk to an expert" [ref=e72] [cursor=pointer]:
                - /url: /contact
              - link "Explore services" [ref=e75] [cursor=pointer]:
                - /url: /services
          - region "Highlights" [ref=e79]:
            - group "1 of 1" [ref=e80]:
              - link "A student holding a laptop and books on campus Solutions Arivoo runs universities, schools and learning programmes (opens in a new tab)" [ref=e81] [cursor=pointer]:
                - /url: https://arivoo.in
                - img "A student holding a laptop and books on campus" [ref=e82]
                - generic [ref=e84]:
                  - paragraph [ref=e88]: Solutions
                  - paragraph [ref=e89]: Arivoo runs universities, schools and learning programmes
                - generic [ref=e93]: (opens in a new tab)
      - region [ref=e94]:
        - generic [ref=e97]:
          - paragraph [ref=e98]: Top Stories
          - heading "Latest Insights, Success Stories and What's Next" [level=2] [ref=e99]
          - paragraph [ref=e100]: Explore our latest news, client success stories, industry insights and upcoming events shaping a smarter, digital future.
        - generic "Stories" [ref=e101]:
          - article [ref=e102]:
            - img "A modern glass office building with the AdamasTech logo" [ref=e104]
            - generic [ref=e105]:
              - paragraph [ref=e106]: 29 October 2026
              - heading "Adamas accelerates enterprise transformation with AI-driven solutions" [level=3] [ref=e107]
              - paragraph [ref=e108]: Discover how Adamas Tech Consulting is leveraging advanced AI and cloud technologies to drive efficiency, innovation, and measurable business impact across global operations.
              - link "Read full story→" [ref=e109] [cursor=pointer]:
                - /url: /insights
      - region [ref=e110]:
        - generic [ref=e111]:
          - generic [ref=e112]:
            - generic [ref=e113]:
              - paragraph [ref=e114]: Partners & Certifications
              - heading "Trusted Partners & Certified Excellence" [level=2] [ref=e115]
            - paragraph [ref=e116]: Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.
          - generic [ref=e117]:
            - button "Pause the partner logos" [ref=e119]
            - region "Partners and certifications" [ref=e122]:
              - list [ref=e123]:
                - listitem [ref=e124]:
                  - img "AWS Partner Network" [ref=e125]
                - listitem [ref=e126]:
                  - img "Cloudera" [ref=e127]
                - listitem [ref=e128]:
                  - img "SAP Partner Open Ecosystem" [ref=e129]
                - listitem [ref=e130]:
                  - img "Google Developers Agency Program" [ref=e131]
                - listitem [ref=e132]:
                  - img "AWS" [ref=e133]
                - listitem [ref=e134]:
                  - img "SAP" [ref=e135]
                - listitem [ref=e136]:
                  - img "Oracle NetSuite" [ref=e137]
                - listitem [ref=e138]:
                  - img "MigNow" [ref=e139]
                - listitem [ref=e140]:
                  - img "Leapwork" [ref=e141]
                - listitem [ref=e142]:
                  - img "Flipkart" [ref=e143]
                - listitem [ref=e144]:
                  - img "techUK" [ref=e145]
                - listitem [ref=e146]:
                  - img "London Chamber of Commerce and Industry (LCCI)" [ref=e147]
                - listitem [ref=e148]:
                  - img "Open edX" [ref=e149]
                - listitem [aria-hidden] [ref=e150]
                - listitem [aria-hidden] [ref=e151]
                - listitem [aria-hidden] [ref=e152]
                - listitem [aria-hidden] [ref=e153]
                - listitem [aria-hidden] [ref=e154]
                - listitem [aria-hidden] [ref=e155]
                - listitem [aria-hidden] [ref=e156]
                - listitem [aria-hidden] [ref=e157]
                - listitem [aria-hidden] [ref=e158]
                - listitem [aria-hidden] [ref=e159]
                - listitem [aria-hidden] [ref=e160]
                - listitem [aria-hidden] [ref=e161]
                - listitem [aria-hidden] [ref=e162]
      - region [ref=e163]:
        - generic [ref=e164]:
          - generic [ref=e165]:
            - generic [aria-hidden]: ADAMAS
            - paragraph [ref=e166]: About Adamas
            - heading "Technology That Moves Businesses Forward" [level=2] [ref=e167]
            - generic [ref=e168]:
              - paragraph [ref=e169]: Adamas Tech Consulting brings together enterprise technology expertise, strategic thinking and implementation capabilities to help organisations solve complex business challenges and build future-ready operations.
              - paragraph [ref=e170]: We connect business ambition with practical implementation across cloud, SAP, AI, data and digital platforms—supporting Indian enterprises and institutions through our engineering and technology delivery capability.
            - link "Discover Adamas" [ref=e171] [cursor=pointer]:
              - /url: /about
            - list [ref=e174]:
              - listitem [ref=e175]: Global delivery
              - listitem [ref=e179]: Senior-led teams
              - listitem [ref=e182]: Quality focused
          - generic [ref=e186]:
            - img "Three colleagues working together at a laptop" [ref=e188]
            - generic [ref=e189]:
              - paragraph [ref=e190]: Our approach
              - paragraph [ref=e191]: Business-first. Technology-enabled.
      - region [ref=e192]:
        - generic [ref=e193]:
          - generic [ref=e195]:
            - paragraph [ref=e196]: Our Services
            - heading "Transforming Enterprise Capabilities Through Technology" [level=2] [ref=e197]
            - paragraph [ref=e198]: Cloud, SAP, digital and AI capabilities designed to strengthen operations, accelerate modernisation and create meaningful business progress.
          - generic [ref=e199]:
            - tablist "Service pillars" [ref=e200]:
              - tab "Cloud Services" [selected] [ref=e201]
              - tab "Digital Transformation" [ref=e202]
              - tab "Data & AI Services" [ref=e203]
            - tabpanel "Cloud Services" [ref=e205]:
              - generic [ref=e206]:
                - generic [ref=e207]:
                  - img "Cloud computing icons over a modern office building" [ref=e208]
                  - generic [aria-hidden] [ref=e210]: "01"
                  - paragraph [ref=e211]: Cloud that Scales your Organisation
                - generic [ref=e212]:
                  - paragraph [ref=e213]: Adamas Tech Consulting helps enterprises, institutions, and public-sector organizations design modern cloud foundations, optimize operations, and apply AI on AWS for measurable business outcomes.
                  - list [ref=e214]:
                    - listitem [ref=e215]:
                      - link "Migration & Modernization" [ref=e216] [cursor=pointer]:
                        - /url: /services/cloud-services/migration-modernization
                    - listitem [ref=e219]:
                      - link "DevOps & SecOps" [ref=e220] [cursor=pointer]:
                        - /url: /services/cloud-services/devops-secops
                    - listitem [ref=e223]:
                      - link "Managed Services" [ref=e224] [cursor=pointer]:
                        - /url: /services/cloud-services/managed-services
                    - listitem [ref=e227]:
                      - link "AI/ML Ops" [ref=e228] [cursor=pointer]:
                        - /url: /services/cloud-services/ai-ml-ops
                    - listitem [ref=e231]:
                      - link "Cloud Automation" [ref=e232] [cursor=pointer]:
                        - /url: /services/cloud-services/cloud-automation
                    - listitem [ref=e235]:
                      - link "Cloud Advisory & Consultation" [ref=e236] [cursor=pointer]:
                        - /url: /services/cloud-services/cloud-advisory-consultation
                  - link "Explore Cloud Services" [ref=e239] [cursor=pointer]:
                    - /url: /services/cloud-services
      - region [ref=e242]:
        - generic [ref=e243]:
          - generic [ref=e244]:
            - generic [ref=e245]:
              - paragraph [ref=e246]: Products & Solutions
              - heading "Purpose-Built Solutions for Complex Business Needs" [level=2] [ref=e247]
              - paragraph [ref=e248]: Focused platforms and accelerators designed around practical operational needs.
            - generic [ref=e250]:
              - link "All solutions" [ref=e251] [cursor=pointer]:
                - /url: /solutions
              - group "solutions controls" [ref=e254]:
                - button "Previous solutions" [ref=e255]
                - paragraph [ref=e258]:
                  - text: "01"
                  - generic [ref=e259]: / 06
                - button "Next solutions" [ref=e260]
          - generic "Products and solutions" [ref=e263]:
            - article [ref=e264]:
              - img "Students and a lecturer talking around a laptop" [ref=e265]
              - generic [ref=e267]: Product
              - generic [ref=e269]:
                - heading [level=3] [ref=e270]:
                  - link "Arivoo" [ref=e271] [cursor=pointer]:
                    - /url: https://arivoo.in
                - paragraph [ref=e272]: Shaping the Future of Education.
                - list [ref=e273]:
                  - listitem [ref=e274]:
                    - link "Arivoo UMS" [ref=e275] [cursor=pointer]:
                      - /url: https://arivoo.in/arivoo-ums
                  - listitem [ref=e278]:
                    - link "Arivoo SMS" [ref=e279] [cursor=pointer]:
                      - /url: https://arivoo.in/arivoo-sms
                  - listitem [ref=e282]:
                    - link "Arivoo LMS" [ref=e283] [cursor=pointer]:
                      - /url: https://arivoo.in/arivoo-lms
                - paragraph [ref=e286]: Visit site
            - article [ref=e289]:
              - img "An analyst reviewing dashboards on a monitor" [ref=e290]
              - generic [ref=e292]: Product
              - generic [ref=e294]:
                - heading [level=3] [ref=e295]:
                  - link "A-EYE" [ref=e296] [cursor=pointer]:
                    - /url: /solutions/a-eye
                - paragraph [ref=e297]: Explore
            - article [ref=e300]:
              - img "A woman reviewing analytics on a large screen" [ref=e301]
              - generic [ref=e303]: Product
              - generic [ref=e305]:
                - heading [level=3] [ref=e306]:
                  - link "AIR-MIND" [ref=e307] [cursor=pointer]:
                    - /url: /solutions/air-mind
                - paragraph [ref=e308]: Explore
            - article [ref=e311]:
              - img "Face recognition illustration" [ref=e312]
              - generic [ref=e314]: AI solution
              - generic [ref=e316]:
                - heading [level=3] [ref=e317]:
                  - link "Face Recognition Security" [ref=e318] [cursor=pointer]:
                    - /url: /solutions/face-recognition
                - paragraph [ref=e319]: Effortless Security through AI Recognition
                - paragraph [ref=e320]: Explore
            - article [ref=e323]:
              - img "Industrial analytics illustration" [ref=e324]
              - generic [ref=e326]: AI solution
              - generic [ref=e328]:
                - heading [level=3] [ref=e329]:
                  - link "Industrial Analytics" [ref=e330] [cursor=pointer]:
                    - /url: /solutions/industrial-analytics
                - paragraph [ref=e331]: Effortless Parking with AI Intelligence
                - paragraph [ref=e332]: Explore
            - article [ref=e335]:
              - img "Businessman holding banknotes" [ref=e336]
              - generic [ref=e338]: AI solution
              - generic [ref=e340]:
                - heading [level=3] [ref=e341]:
                  - link "Asset Tracking" [ref=e342] [cursor=pointer]:
                    - /url: /solutions/asset-tracking
                - paragraph [ref=e343]: Boosting Cash Forecasting by 30%
                - paragraph [ref=e344]: Explore
      - region [ref=e347]:
        - generic [ref=e348]:
          - generic [aria-hidden]: IMPACT
          - generic [ref=e350]:
            - paragraph [ref=e351]: Client Outcomes
            - heading "Real Challenges. Meaningful Transformation." [level=2] [ref=e352]
          - list [ref=e354]:
            - listitem [ref=e355]:
              - article [ref=e356]:
                - paragraph [ref=e357]: Education Technology
                - heading "Connecting the entire learning journey through Arivoo." [level=3] [ref=e358]
                - paragraph [ref=e359]: One digital ecosystem for academic and administrative experiences.
                - link "Read Case Study" [ref=e360] [cursor=pointer]:
                  - /url: /solutions/arivoo
      - region [ref=e363]:
        - generic [ref=e365]:
          - navigation "Industries" [ref=e366]:
            - generic [ref=e367]:
              - paragraph [ref=e368]: All Industries
              - list [ref=e369]:
                - listitem [ref=e370]:
                  - link "Healthcare" [ref=e371] [cursor=pointer]:
                    - /url: "#industry-healthcare"
                - listitem [ref=e375]:
                  - link "Financial Services" [ref=e376] [cursor=pointer]:
                    - /url: "#industry-financial-services"
                - listitem [ref=e379]:
                  - link "Retail" [ref=e380] [cursor=pointer]:
                    - /url: "#industry-retail"
                - listitem [ref=e383]:
                  - link "Education" [ref=e384] [cursor=pointer]:
                    - /url: "#industry-education"
          - generic [ref=e389]:
            - paragraph [ref=e390]: Industries
            - heading "Industry Growth" [level=2] [ref=e391]
            - paragraph [ref=e392]: We deliver smart technology solutions that help businesses improve efficiency, simplify operations, and grow faster.
            - generic "Industry details" [ref=e393]:
              - article [ref=e394]:
                - generic [ref=e395]:
                  - heading "Healthcare" [level=3] [ref=e396]
                  - generic [ref=e397]:
                    - paragraph [ref=e398]: We help healthcare providers improve patient care and manage hospital operations with smart digital solutions.
                    - paragraph [ref=e399]: Our technology helps organize patient records, simplify daily tasks, and keep healthcare data secure.
                  - 'link "Explore Industry : Healthcare" [ref=e400] [cursor=pointer]':
                    - /url: /contact
                    - text: Explore Industry
                    - generic [ref=e401]: ": Healthcare"
              - article [ref=e402]:
                - generic [ref=e403]:
                  - heading "Financial Services" [level=3] [ref=e404]
                  - generic [ref=e405]:
                    - paragraph [ref=e406]: We help banks, financial institutions, and financial service providers improve their operations with reliable digital solutions.
                    - paragraph [ref=e407]: Our technology helps protect financial data, simplify transactions, manage information, and deliver better customer experiences.
                  - 'link "Explore Industry : Financial Services" [ref=e408] [cursor=pointer]':
                    - /url: /contact
                    - text: Explore Industry
                    - generic [ref=e409]: ": Financial Services"
              - article [ref=e410]:
                - generic [ref=e411]:
                  - heading "Retail" [level=3] [ref=e412]
                  - generic [ref=e413]:
                    - paragraph [ref=e414]: Drive growth in the retail and e-commerce sector with scalable platforms that support online storefronts, personalized marketing, inventory management, and CRM integration.
                    - paragraph [ref=e415]: Our solutions enhance customer experience, streamline operations, and provide actionable insights for data-driven decision-making.
                  - 'link "Explore Industry : Retail" [ref=e416] [cursor=pointer]':
                    - /url: /contact
                    - text: Explore Industry
                    - generic [ref=e417]: ": Retail"
              - article [ref=e418]:
                - generic [ref=e419]:
                  - heading "Education" [level=3] [ref=e420]
                  - generic [ref=e421]:
                    - paragraph [ref=e422]: Empower educational institutions with advanced Learning Management Systems (LMS), University Management Systems (UMS), and School Management Systems (SMS).
                    - paragraph [ref=e423]: Our solutions streamline operations, enhance student engagement, and support digital learning, ensuring an efficient and engaging educational experience.
                  - 'link "Explore Industry : Education" [ref=e424] [cursor=pointer]':
                    - /url: /contact
                    - text: Explore Industry
                    - generic [ref=e425]: ": Education"
            - generic [ref=e430]:
              - button "Previous industry" [disabled] [ref=e431]
              - button "Next industry" [ref=e434]
      - region [ref=e437]:
        - generic [ref=e440]:
          - paragraph [ref=e441]: The Adamas Difference
          - heading "Why Organisations Choose Adamas" [level=2] [ref=e442]
        - generic [ref=e443]:
          - paragraph [ref=e449]: One connected delivery ecosystem
          - list [ref=e450]:
            - listitem [ref=e451]:
              - generic [ref=e458]:
                - heading "Enterprise technology expertise" [level=3] [ref=e459]
                - paragraph [ref=e460]: Practical expertise across complex enterprise technology environments.
            - listitem [ref=e461]:
              - generic [ref=e466]:
                - heading "End-to-end transformation" [level=3] [ref=e467]
                - paragraph [ref=e468]: Connected thinking from strategy and design through implementation and evolution.
            - listitem [ref=e469]:
              - generic [ref=e475]:
                - heading "Cloud, SAP and AI expertise" [level=3] [ref=e476]
                - paragraph [ref=e477]: Capabilities aligned to modern enterprise transformation priorities.
            - listitem [ref=e478]:
              - generic [ref=e483]:
                - heading "Strategic consulting" [level=3] [ref=e484]
                - paragraph [ref=e485]: Technology direction grounded in business context and operational needs.
            - listitem [ref=e486]:
              - generic [ref=e491]:
                - heading "Quality-focused delivery" [level=3] [ref=e492]
                - paragraph [ref=e493]: Structured delivery with a consistent focus on quality.
            - listitem [ref=e494]:
              - generic [ref=e500]:
                - heading "International presence" [level=3] [ref=e501]
                - paragraph [ref=e502]: Cross-market perspective supported by technology delivery capability.
      - region [ref=e503]:
        - generic [ref=e504]:
          - generic [ref=e506]:
            - paragraph [ref=e507]: Events & Insights
            - heading "Connect With Ideas That Shape Tomorrow" [level=2] [ref=e508]
          - list [ref=e510]:
            - listitem [ref=e511]:
              - paragraph [ref=e512]: Insight · Trusted Cloud
              - heading "Building data sovereignty into your cloud strategy" [level=3] [ref=e513]
              - link "Read Insight" [ref=e514] [cursor=pointer]:
                - /url: /insights
            - listitem [ref=e517]:
              - paragraph [ref=e518]: Point of View · Enterprise AI
              - heading "Where agentic workflows can create practical value" [level=3] [ref=e519]
              - link "Read Insight" [ref=e520] [cursor=pointer]:
                - /url: /insights
            - listitem [ref=e523]:
              - paragraph [ref=e524]: Tech Discussion · Resilience
              - heading "Modernisation without compromising operational continuity" [level=3] [ref=e525]
              - link "Explore Discussion" [ref=e526] [cursor=pointer]:
                - /url: /insights
      - region [ref=e529]:
        - generic [ref=e530]:
          - generic [aria-hidden]: NEXT
          - generic [ref=e532]:
            - paragraph [ref=e533]: Top Stories
            - heading "Latest Perspectives & Updates" [level=2] [ref=e534]
          - generic [ref=e535]:
            - article [ref=e536]:
              - img "Floating charts and dashboards illustration" [ref=e537]
              - generic [ref=e538]:
                - paragraph [ref=e539]: Data Intelligence · Publication date pending
                - heading "Turning trusted enterprise data into sharper business decisions." [level=3] [ref=e540]
                - paragraph [ref=e541]: A practical perspective on governance, forecasting and decision intelligence.
                - 'link "Read More : Turning trusted enterprise data into sharper business decisions." [ref=e542] [cursor=pointer]':
                  - /url: /insights
                  - text: Read More
                  - generic [ref=e543]: ": Turning trusted enterprise data into sharper business decisions."
            - generic [ref=e546]:
              - article [ref=e547]:
                - img "A padlock on a server illustration" [ref=e548]
                - generic [ref=e549]:
                  - paragraph [ref=e550]: Digital Resilience
                  - heading "Modernising critical systems with security built in" [level=3] [ref=e551]
                  - 'link "Read More : Modernising critical systems with security built in" [ref=e552] [cursor=pointer]':
                    - /url: /insights
                    - text: Read More
                    - generic [ref=e553]: ": Modernising critical systems with security built in"
              - article [ref=e556]:
                - generic [ref=e558]:
                  - paragraph [ref=e559]: Enterprise AI · Date pending
                  - heading "Responsible AI starts with the right operating model." [level=3] [ref=e560]
                  - paragraph [ref=e561]: Principles for moving from isolated experiments to measurable business outcomes.
                  - 'link "Read More : Responsible AI starts with the right operating model." [ref=e562] [cursor=pointer]':
                    - /url: /insights
                    - text: Read More
                    - generic [ref=e563]: ": Responsible AI starts with the right operating model."
      - region [ref=e566]:
        - generic [ref=e567]:
          - generic [ref=e569]:
            - paragraph [ref=e570]: Tech Excellence
            - heading "Develop Innovations That Propel Your Business" [level=2] [ref=e571]
          - list [ref=e572]:
            - listitem [ref=e573]:
              - article [ref=e574]:
                - heading "Customized Solutions" [level=3] [ref=e576]
                - paragraph [ref=e577]: A client-centric approach that emphasizes collaboration, understanding goals, and creating custom solutions for growth.
            - listitem [ref=e578]:
              - article [ref=e579]:
                - heading "Proven Expertise" [level=3] [ref=e581]
                - paragraph [ref=e582]: Extensive experience across multiple sectors, delivering tailored solutions that drive measurable results.
            - listitem [ref=e583]:
              - article [ref=e584]:
                - heading "Certified Quality" [level=3] [ref=e586]
                - paragraph [ref=e587]: ISO 9001, ISO 27001 certified, and CMMI Level 3, ensuring top standards of quality, security, and compliance.
                - list "Certifications" [ref=e588]:
                  - listitem [ref=e589]:
                    - img "BSI ISO 9001:2015 Quality Management certification badge" [ref=e590]
                  - listitem [ref=e591]:
                    - img "DQS ISO/IEC 27001 Information Security certification badge" [ref=e592]
                  - listitem [ref=e593]:
                    - img "CMMI Maturity Level 3 appraised badge" [ref=e594]
            - listitem [ref=e595]:
              - article [ref=e596]:
                - heading "Comprehensive Services" [level=3] [ref=e598]
                - paragraph [ref=e599]: Offering full-cycle support from consultation to deployment, ensuring seamless integration and long-term success.
      - region [ref=e600]:
        - generic [ref=e604]:
          - paragraph [ref=e605]: Our Presence
          - heading "Explore our global presence around the world" [level=2] [ref=e606]
        - list [ref=e608]:
          - listitem [ref=e609]:
            - article [ref=e610]:
              - paragraph [ref=e611]: Your nearest office
              - heading "Bengaluru" [level=3] [ref=e612]
              - generic [ref=e613]:
                - generic [ref=e614]: 27th Main Rd, 1st Sector
                - generic [ref=e615]: HSR Layout, Bengaluru
                - generic [ref=e616]: Karnataka 560102
          - listitem [ref=e617]:
            - article [ref=e618]:
              - paragraph [ref=e619]: United Kingdom
              - heading "London" [level=3] [ref=e620]
              - generic [ref=e621]:
                - generic [ref=e622]: Golden Cross House
                - generic [ref=e623]: 8 Duncannon Street
                - generic [ref=e624]: London WC2N 4JF
              - link "+44 7768 706988" [ref=e625] [cursor=pointer]:
                - /url: tel:+447768706988
          - listitem [ref=e628]:
            - article [ref=e629]:
              - paragraph [ref=e630]: United States
              - heading "Palo Alto" [level=3] [ref=e631]
              - generic [ref=e632]:
                - generic [ref=e633]: 530 Lytton Avenue, 2nd Floor
                - generic [ref=e634]: Palo Alto, CA 94301
          - listitem [ref=e635]:
            - article [ref=e636]:
              - paragraph [ref=e637]: United Arab Emirates
              - heading "Dubai" [level=3] [ref=e638]
              - generic [ref=e639]:
                - generic [ref=e640]: B-2101, 1601 & 801 Latifa Tower
                - generic [ref=e641]: near Trade Centre, Sheikh Zayed Road
                - generic [ref=e642]: Dubai, UAE
              - link "+971 4 705 6001" [ref=e643] [cursor=pointer]:
                - /url: tel:+97147056001
          - listitem [ref=e646]:
            - article [ref=e647]:
              - paragraph [ref=e648]: India
              - heading "Kolkata" [level=3] [ref=e649]
              - generic [ref=e650]:
                - generic [ref=e651]: Haute Street, Topsia Road
                - generic [ref=e652]: Kolkata, West Bengal 700046
      - region [ref=e653]:
        - generic [ref=e655]:
          - img "Three colleagues talking over coffee" [ref=e657]
          - generic [ref=e658]:
            - paragraph [ref=e659]: Do you have any question?
            - heading "Let's Talk About Business Solutions With Us" [level=2] [ref=e660]
            - generic [ref=e661]:
              - generic [ref=e662]:
                - generic [ref=e663]: Full Name
                - textbox "Full Name" [ref=e665]
              - generic [ref=e666]:
                - generic [ref=e667]: Your Email
                - textbox "Your Email" [ref=e669]
              - generic [ref=e670]:
                - generic [ref=e671]: Your Phone
                - generic [ref=e672]:
                  - generic [ref=e673]: Country
                  - combobox "Country" [ref=e674] [cursor=pointer]:
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
                  - textbox "Your Phone" [ref=e675]
              - generic [ref=e676]:
                - generic [ref=e677]: What's your Project about?
                - textbox "What's your Project about?" [ref=e678]
              - generic [ref=e679]:
                - generic [ref=e680]:
                  - checkbox "I agree to the Privacy Policy and Terms of Use." [ref=e681]
                  - generic [ref=e682]:
                    - text: I agree to the
                    - link "Privacy Policy" [ref=e683] [cursor=pointer]:
                      - /url: /privacy-policy
                    - text: and
                    - link "Terms of Use" [ref=e684] [cursor=pointer]:
                      - /url: /terms-of-use
                    - text: .
                - button "Submit Now!" [ref=e685]
  - contentinfo [ref=e686]:
    - generic [ref=e687]:
      - generic [ref=e688]:
        - generic [ref=e689]:
          - link "AdamasTech Consulting, India homepage" [ref=e690] [cursor=pointer]:
            - /url: /in/
          - list [ref=e692]:
            - listitem [ref=e693]:
              - paragraph [ref=e694]: India
              - generic [ref=e695]:
                - link "+91-6296680677" [ref=e696] [cursor=pointer]:
                  - /url: tel:+916296680677
                - link "marketing@adamastech.in" [ref=e699] [cursor=pointer]:
                  - /url: mailto:marketing@adamastech.in
            - listitem [ref=e703]:
              - paragraph [ref=e704]: UK & Ireland
              - generic [ref=e705]:
                - link "+44 7768 706988" [ref=e706] [cursor=pointer]:
                  - /url: tel:+447768706988
                - link "marketing@adamastech.in" [ref=e709] [cursor=pointer]:
                  - /url: mailto:marketing@adamastech.in
            - listitem [ref=e713]:
              - paragraph [ref=e714]: GCC
              - generic [ref=e715]:
                - link "+971 4 705 6001" [ref=e716] [cursor=pointer]:
                  - /url: tel:+97147056001
                - link "marketing@adamastech.in" [ref=e719] [cursor=pointer]:
                  - /url: mailto:marketing@adamastech.in
        - navigation "Footer" [ref=e723]:
          - generic [ref=e724]:
            - heading "Company" [level=2] [ref=e725]
            - list [ref=e726]:
              - listitem [ref=e727]:
                - link "About Us" [ref=e728] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e729]:
                - link "Team" [ref=e730] [cursor=pointer]:
                  - /url: /about/team
              - listitem [ref=e731]:
                - link "Case Studies" [ref=e732] [cursor=pointer]:
                  - /url: /case-studies
              - listitem [ref=e733]:
                - link "Credentials" [ref=e734] [cursor=pointer]:
                  - /url: /credentials
              - listitem [ref=e735]:
                - link "Contact" [ref=e736] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e737]:
            - heading "Services" [level=2] [ref=e738]
            - list [ref=e739]:
              - listitem [ref=e740]:
                - link "Cloud Services" [ref=e741] [cursor=pointer]:
                  - /url: /services/cloud-services
              - listitem [ref=e742]:
                - link "Digital Transformation" [ref=e743] [cursor=pointer]:
                  - /url: /services/digital-transformation
              - listitem [ref=e744]:
                - link "Data & AI Services" [ref=e745] [cursor=pointer]:
                  - /url: /services/ai-services
              - listitem [ref=e746]:
                - link "Services overview" [ref=e747] [cursor=pointer]:
                  - /url: /services
          - generic [ref=e748]:
            - heading "Solutions" [level=2] [ref=e749]
            - list [ref=e750]:
              - listitem [ref=e751]:
                - link "Arivoo" [ref=e752] [cursor=pointer]:
                  - /url: https://arivoo.in
              - listitem [ref=e755]:
                - link "Face Recognition Security" [ref=e756] [cursor=pointer]:
                  - /url: /solutions/face-recognition
              - listitem [ref=e757]:
                - link "Industrial Analytics" [ref=e758] [cursor=pointer]:
                  - /url: /solutions/industrial-analytics
              - listitem [ref=e759]:
                - link "Asset Tracking" [ref=e760] [cursor=pointer]:
                  - /url: /solutions/asset-tracking
              - listitem [ref=e761]:
                - link "TestGUARD" [ref=e762] [cursor=pointer]:
                  - /url: https://arivoo.in/testguard
              - listitem [ref=e765]:
                - link "All solutions" [ref=e766] [cursor=pointer]:
                  - /url: /solutions
          - generic [ref=e767]:
            - heading "Insights" [level=2] [ref=e768]
            - list [ref=e769]:
              - listitem [ref=e770]:
                - link "Events" [ref=e771] [cursor=pointer]:
                  - /url: /insights/events
              - listitem [ref=e772]:
                - generic [ref=e773]:
                  - text: Blog
                  - generic [ref=e774]: (coming soon)
      - region [ref=e775]:
        - heading "Our offices" [level=2] [ref=e776]
        - list [ref=e777]:
          - listitem [ref=e778]:
            - paragraph [ref=e779]: London
            - generic [ref=e780]:
              - generic [ref=e781]: Golden Cross House
              - generic [ref=e782]: 8 Duncannon Street
              - generic [ref=e783]: London WC2N 4JF
              - link "+44 7768 706988" [ref=e784] [cursor=pointer]:
                - /url: tel:+447768706988
          - listitem [ref=e787]:
            - paragraph [ref=e788]: Palo Alto
            - generic [ref=e789]:
              - generic [ref=e790]: 530 Lytton Avenue, 2nd Floor
              - generic [ref=e791]: Palo Alto, CA 94301
          - listitem [ref=e792]:
            - paragraph [ref=e793]: Dubai
            - generic [ref=e794]:
              - generic [ref=e795]: B-2101, 1601 & 801 Latifa Tower
              - generic [ref=e796]: near Trade Centre, Sheikh Zayed Road
              - generic [ref=e797]: Dubai, UAE
              - link "+971 4 705 6001" [ref=e798] [cursor=pointer]:
                - /url: tel:+97147056001
          - listitem [ref=e801]:
            - paragraph [ref=e802]: Bengaluru
            - generic [ref=e803]:
              - generic [ref=e804]: 27th Main Rd, 1st Sector
              - generic [ref=e805]: HSR Layout, Bengaluru
              - generic [ref=e806]: Karnataka 560102
          - listitem [ref=e807]:
            - paragraph [ref=e808]: Kolkata
            - generic [ref=e809]:
              - generic [ref=e810]: Haute Street, Topsia Road
              - generic [ref=e811]: Kolkata, West Bengal 700046
      - generic [ref=e812]:
        - generic [ref=e813]:
          - paragraph [ref=e814]: © 2026 AdamasTech Consulting
          - list "Legal" [ref=e815]:
            - listitem [ref=e816]:
              - link "Privacy Policy" [ref=e817] [cursor=pointer]:
                - /url: /privacy-policy
            - listitem [ref=e818]:
              - link "Cookie Policy" [ref=e819] [cursor=pointer]:
                - /url: /cookie-policy
            - listitem [ref=e820]:
              - link "Terms of Use" [ref=e821] [cursor=pointer]:
                - /url: /terms-of-use
            - listitem [ref=e822]:
              - link "Credentials" [ref=e823] [cursor=pointer]:
                - /url: /credentials
        - generic [ref=e824]:
          - list "Social media" [ref=e825]:
            - listitem [ref=e826]:
              - link "Facebook" [ref=e827] [cursor=pointer]:
                - /url: https://www.facebook.com/AdamasTechConsulting/
            - listitem [ref=e828]:
              - link "LinkedIn" [ref=e829] [cursor=pointer]:
                - /url: https://www.linkedin.com/company/adamas-tech-consulting/
          - group [ref=e830]:
            - 'generic "Region: India. Change region" [ref=e831] [cursor=pointer]': India
  - alert [ref=e838]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import fs from "node:fs";
  3   | import path from "node:path";
  4   | 
  5   | /** Region routing on bare "/", the /ae/ to /gcc/ move, the region cookie, and the legacy redirect table. */
  6   | 
  7   | const COUNTRY_CASES: [string | null, string][] = [
  8   |   ["IN", "/in/"],
  9   |   ["GB", "/uk/"],
  10  |   ["IE", "/uk/"],
  11  |   ["AE", "/gcc/"],
  12  |   ["SA", "/gcc/"],
  13  |   ["QA", "/gcc/"],
  14  |   ["KW", "/gcc/"],
  15  |   ["BH", "/gcc/"],
  16  |   ["OM", "/gcc/"],
  17  |   ["US", null as unknown as string],
  18  |   [null, null as unknown as string],
  19  | ];
  20  | 
  21  | test.describe("bare / routing", () => {
  22  |   for (const [country, expected] of COUNTRY_CASES) {
  23  |     test(`country ${country ?? "(none)"} -> ${expected ?? "DEFAULT_REGION"}`, async ({ request }) => {
  24  |       const res = await request.get("/", { maxRedirects: 0, headers: country ? { "x-vercel-ip-country": country } : {} });
  25  |       expect(res.status()).toBe(307);
  26  |       const loc = res.headers()["location"];
  27  |       if (expected) expect(loc).toMatch(new RegExp(`${expected.replace(/\//g, "\\/")}$`));
  28  |       else expect(loc).toMatch(/\/(in|uk|gcc)\/$/);
  29  |       expect(res.headers()["cache-control"]).toContain("no-store");
  30  |     });
  31  |   }
  32  | 
  33  |   test("the region cookie beats the country; a legacy ae cookie still works", async ({ request }) => {
  34  |     const r1 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=uk" } });
  35  |     expect(r1.headers()["location"]).toMatch(/\/uk\/$/);
  36  |     const r2 = await request.get("/", { maxRedirects: 0, headers: { "x-vercel-ip-country": "IN", cookie: "region=ae" } });
  37  |     expect(r2.headers()["location"]).toMatch(/\/gcc\/$/);
  38  |     const r3 = await request.get("/?x=1", { maxRedirects: 0, headers: { cookie: "region=in" } });
  39  |     expect(r3.headers()["location"]).toMatch(/\/in\/\?x=1$/);
  40  |   });
  41  | 
  42  |   test("/ae/ and anything under it is a single 301 to /gcc/", async ({ request }) => {
  43  |     for (const p of ["/ae", "/ae/", "/ae/anything?x=1"]) {
  44  |       const res = await request.get(p, { maxRedirects: 0 });
  45  |       expect(res.status(), p).toBe(301);
  46  |       expect(res.headers()["location"], p).toMatch(/\/gcc\/(\?x=1)?$/);
  47  |     }
  48  |     const home = await request.get("/gcc/", { maxRedirects: 0 });
  49  |     expect(home.status()).toBe(200);
  50  |   });
  51  | 
  52  |   test("homepages are canonical with a trailing slash; inner pages without", async ({ request }) => {
  53  |     const a = await request.get("/in", { maxRedirects: 0 });
  54  |     expect(a.status()).toBe(308);
  55  |     expect(a.headers()["location"]).toMatch(/\/in\/$/);
  56  |     const b = await request.get("/services/", { maxRedirects: 0 });
  57  |     expect(b.status()).toBe(308);
  58  |     expect(b.headers()["location"]).toMatch(/\/services$/);
  59  |     for (const p of ["/IN/", "/xx/", "/in/extra"]) expect((await request.get(p, { maxRedirects: 0 })).status(), p).toBe(404);
  60  |   });
  61  | 
  62  |   test("the region switcher sets the cookie and swaps the homepage", async ({ page, context }) => {
  63  |     await page.goto("/in/");
> 64  |     await page.locator("summary[aria-label^='Region']").click();
      |                                                         ^ Error: locator.click: Error: strict mode violation: locator('summary[aria-label^=\'Region\']') resolved to 2 elements:
  65  |     await page.locator("a[href='/gcc/']").first().click();
  66  |     await expect(page).toHaveURL(/\/gcc\/$/);
  67  |     const cookie = (await context.cookies()).find((c) => c.name === "region");
  68  |     expect(cookie?.value).toBe("gcc");
  69  |     expect(await page.getAttribute("html", "lang")).toMatch(/en-/);
  70  |   });
  71  | });
  72  | 
  73  | test.describe("legacy redirects", () => {
  74  |   const table = JSON.parse(fs.readFileSync(path.join(process.cwd(), "lib/generated/redirects.json"), "utf8")) as Record<string, [string, number]>;
  75  |   /** The old homepage URLs land on "/" on purpose; the second hop is the geo decision (docs/deploy.md). */
  76  |   const toRoot = Object.entries(table).filter(([, [to]]) => to === "/").map(([from]) => from);
  77  | 
  78  |   test("every row resolves in one hop to a 200 (homepage rows via the geo redirect)", async ({ request }) => {
  79  |     const bad: string[] = [];
  80  |     for (const [from, [to, status]] of Object.entries(table)) {
  81  |       const res = await request.get(from, { maxRedirects: 0 });
  82  |       if (res.status() !== (status === 302 ? 302 : 301)) {
  83  |         bad.push(`${from}: ${res.status()} (expected ${status})`);
  84  |         continue;
  85  |       }
  86  |       const loc = res.headers()["location"] ?? "";
  87  |       if (to.startsWith("http")) continue;
  88  |       const target = await request.get(loc, { maxRedirects: 0 });
  89  |       if (toRoot.includes(from)) {
  90  |         if (target.status() !== 307) bad.push(`${from} -> ${loc}: ${target.status()} (expected the geo 307)`);
  91  |       } else if (target.status() !== 200) {
  92  |         bad.push(`${from} -> ${loc}: ${target.status()}`);
  93  |       }
  94  |     }
  95  |     expect(bad, bad.join("\n")).toEqual([]);
  96  |   });
  97  | 
  98  |   test("/e-invoicing-uae lands on /gcc/ in one hop (BUG-018)", async ({ request }) => {
  99  |     const res = await request.get("/e-invoicing-uae", { maxRedirects: 0 });
  100 |     expect(res.status()).toBe(301);
  101 |     expect(res.headers()["location"]).toMatch(/\/gcc\/$/);
  102 |   });
  103 | });
  104 | 
```