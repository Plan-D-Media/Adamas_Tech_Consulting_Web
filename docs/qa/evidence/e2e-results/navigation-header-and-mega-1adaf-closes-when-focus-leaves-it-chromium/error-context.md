# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> header and mega menus >> the panel closes when focus leaves it
- Location: tests\e2e\navigation.spec.ts:59:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.focus: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('button[data-menu-key=\'about\']')

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
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { internalLinks } from "./helpers";
  3   | 
  4   | /** Header, mega menus (mouse and keyboard), mobile drawer, skip link and footer links. */
  5   | 
  6   | const MENU_KEYS = ["about", "services", "solutions", "insights"];
  7   | 
  8   | async function openKey(page: Page, key: string) {
  9   |   const trigger = page.locator(`button[data-menu-key="${key}"]`);
  10  |   if ((await trigger.count()) === 0) return null;
  11  |   await trigger.click();
  12  |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  13  |   const panelId = await trigger.getAttribute("aria-controls");
  14  |   return page.locator(`#${panelId}`);
  15  | }
  16  | 
  17  | test.describe("header and mega menus", () => {
  18  |   test("every mega menu opens on click and shows its panel; only one is open at a time", async ({ page }) => {
  19  |     await page.goto("/in/");
  20  |     const triggers = page.locator("nav[aria-label='Main'] button[data-menu-key]");
  21  |     const count = await triggers.count();
  22  |     expect(count).toBeGreaterThanOrEqual(3);
  23  |     for (let i = 0; i < count; i++) {
  24  |       const key = (await triggers.nth(i).getAttribute("data-menu-key")) as string;
  25  |       const panel = await openKey(page, key);
  26  |       expect(panel).not.toBeNull();
  27  |       await expect(panel!).toBeVisible();
  28  |       expect(await page.locator("nav[aria-label='Main'] button[aria-expanded='true']").count()).toBe(1);
  29  |     }
  30  |   });
  31  | 
  32  |   test("hover intent opens after the delay and closes when the pointer leaves", async ({ page }) => {
  33  |     await page.goto("/in/");
  34  |     const trigger = page.locator("button[data-menu-key='services']");
  35  |     await trigger.hover();
  36  |     await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 2000 });
  37  |     await page.mouse.move(10, 600);
  38  |     await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 2000 });
  39  |   });
  40  | 
  41  |   test("keyboard: Enter opens, Tab moves into the panel, Esc closes and returns focus (BUG-008)", async ({ page }) => {
  42  |     await page.goto("/in/");
  43  |     for (const key of MENU_KEYS) {
  44  |       const trigger = page.locator(`button[data-menu-key="${key}"]`);
  45  |       if ((await trigger.count()) === 0) continue;
  46  |       await trigger.focus();
  47  |       await page.keyboard.press("Enter");
  48  |       await expect(trigger).toHaveAttribute("aria-expanded", "true");
  49  |       const panelId = (await trigger.getAttribute("aria-controls")) as string;
  50  |       await page.keyboard.press("Tab");
  51  |       const inPanel = await page.evaluate((id) => !!document.activeElement?.closest(`#${CSS.escape(id)}`), panelId);
  52  |       expect(inPanel, `Tab from the ${key} trigger lands inside its panel`).toBe(true);
  53  |       await page.keyboard.press("Escape");
  54  |       await expect(trigger).toHaveAttribute("aria-expanded", "false");
  55  |       expect(await page.evaluate(() => document.activeElement?.getAttribute("data-menu-key"))).toBe(key);
  56  |     }
  57  |   });
  58  | 
  59  |   test("the panel closes when focus leaves it", async ({ page }) => {
  60  |     await page.goto("/in/");
  61  |     const trigger = page.locator("button[data-menu-key='about']");
> 62  |     await trigger.focus();
      |                   ^ Error: locator.focus: Test timeout of 60000ms exceeded.
  63  |     await page.keyboard.press("Enter");
  64  |     await expect(trigger).toHaveAttribute("aria-expanded", "true");
  65  |     // Tab through every focusable in the panel and out the other side.
  66  |     for (let i = 0; i < 40; i++) {
  67  |       await page.keyboard.press("Tab");
  68  |       if ((await trigger.getAttribute("aria-expanded")) === "false") break;
  69  |     }
  70  |     await expect(trigger).toHaveAttribute("aria-expanded", "false");
  71  |   });
  72  | 
  73  |   test("header links resolve and external links open in a new tab with noopener", async ({ page }) => {
  74  |     await page.goto("/in/");
  75  |     const external = page.locator("header a[target='_blank']");
  76  |     const n = await external.count();
  77  |     for (let i = 0; i < n; i++) expect(await external.nth(i).getAttribute("rel")).toMatch(/noopener/);
  78  |     const talk = page.locator("header a", { hasText: "Talk to an expert" }).first();
  79  |     await expect(talk).toHaveAttribute("href", "/contact");
  80  |   });
  81  | });
  82  | 
  83  | test.describe("mobile drawer", () => {
  84  |   test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  85  | 
  86  |   test("opens, traps focus, closes on Escape and returns focus", async ({ page }) => {
  87  |     await page.goto("/in/");
  88  |     const summary = page.locator("details.nav-drawer > summary");
  89  |     await summary.click();
  90  |     await expect(page.locator("details.nav-drawer")).toHaveAttribute("open", "");
  91  |     await expect(page.locator("details.nav-drawer nav[aria-label='Main']")).toBeVisible();
  92  |     for (let i = 0; i < 60; i++) {
  93  |       await page.keyboard.press("Tab");
  94  |       const inside = await page.evaluate(() => !!document.activeElement?.closest("details.nav-drawer"));
  95  |       expect(inside, `Tab ${i} stays inside the drawer`).toBe(true);
  96  |     }
  97  |     await page.keyboard.press("Escape");
  98  |     await expect(page.locator("details.nav-drawer")).not.toHaveAttribute("open", "");
  99  |   });
  100 | });
  101 | 
  102 | test.describe("skip link and footer", () => {
  103 |   test("skip link focuses the visible main, also after a client-side navigation (BUG-013)", async ({ page }) => {
  104 |     await page.goto("/in/");
  105 |     await page.locator("summary[aria-label^='Region']").click();
  106 |     await page.locator("a[href='/uk/']").first().click();
  107 |     await expect(page).toHaveURL(/\/uk\/$/);
  108 |     await page.keyboard.press("Tab");
  109 |     const skip = page.locator("a[href='#main']").first();
  110 |     await expect(skip).toBeFocused();
  111 |     await page.keyboard.press("Enter");
  112 |     const focusedVisibleMain = await page.evaluate(() => {
  113 |       const el = document.activeElement as HTMLElement | null;
  114 |       return !!el && el.tagName === "MAIN" && el.getClientRects().length > 0;
  115 |     });
  116 |     expect(focusedVisibleMain).toBe(true);
  117 |   });
  118 | 
  119 |   test("every internal link on the homepage and footer answers 200 in one hop", async ({ page }) => {
  120 |     await page.goto("/in/");
  121 |     const links = await internalLinks(page);
  122 |     expect(links.length).toBeGreaterThan(20);
  123 |     const bad: string[] = [];
  124 |     for (const href of links) {
  125 |       const res = await page.request.get(href, { maxRedirects: 0 });
  126 |       if (res.status() !== 200) bad.push(`${href} -> ${res.status()}`);
  127 |     }
  128 |     expect(bad, bad.join("\n")).toEqual([]);
  129 |   });
  130 | });
  131 | 
```