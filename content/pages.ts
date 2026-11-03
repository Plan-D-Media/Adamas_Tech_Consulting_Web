import type { PageSeed } from "./types";

/**
 * Company and utility pages (design round 2). The `blocks` JSON shape per template is validated with zod in
 * lib/data/pages.ts. Copy is verbatim from docs/source-content/ (about-us.md, contact.md, privacy-policy.md,
 * terms-of-use.md, in.md); text inside HIDDEN / RESPONSIVE markers (theme demo content) is not migrated.
 * Every placeholder, held-back sentence and typo fix is logged in docs/round2-notes/company.md.
 */

// ── Legal page shape (shared with lib/data/pages.ts) ─────────────────────

export interface LegalPart {
  /** Prose-format text (blank line = new block, "- " list, "### " sub-heading). */
  text?: string;
  table?: { columns: string[]; rows: string[][] };
}

export interface LegalSection {
  id: string;
  title: string;
  parts: LegalPart[];
  /** Links that were inline in the live text (Prose has no inline links yet), listed under the section. */
  links: { label: string; href: string }[];
}

interface LegalDoc {
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

const LEGAL_NOTE =
  "Migrated verbatim from the live page (Termly template, last updated February 15, 2024). Presentation changes only: all-caps section headings set in sentence case; closing quotes ‘…‘ corrected to ‘…’; inline links listed under each section. CONFLICT: addresses and emails differ from the rest of the site (see CONTENT_TODO.md, Offices and contact). Legal review before launch.";

// Converted from docs/source-content/privacy-policy.md (scratch converter; headings mapped by hand).
const privacy = {
  updated: "February 15, 2024",
  sections: [
    {
      id: "summary-of-key-points",
      title: "Summary of key points",
      parts: [
        {
          text: "This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.\n\n### What personal information do we process?\n\nWhen you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about personal information you disclose to us.\n\n### Do we process any sensitive personal information?\n\nWe do not process sensitive personal information.\n\n### Do we receive any information from third parties?\n\nWe do not receive any information from third parties.\n\n### How do we process your information?\n\nWe process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about how we process your information.\n\n### In what situations and with which parties do we share personal information?\n\nWe may share information in specific situations and with specific third parties. Learn more about when and with whom we share your personal information.\n\n### How do we keep your information safe?\n\nWe have organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about how we keep your information safe.\n\n### What are your rights?\n\nDepending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about your privacy rights.\n\n### How do you exercise your rights?\n\nThe easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.\n\nWant to learn more about what we do with any information we collect? Review the privacy notice in full.",
        },
      ],
      links: [
        {
          label: "data subject access request",
          href: "https://app.termly.io/notify/c17c8d1c-7a6b-4cd2-aa5c-ff0e40c3e4b6",
        },
      ],
    },
    {
      id: "what-information-do-we-collect",
      title: "1. What information do we collect?",
      parts: [
        {
          text: "### Personal information you disclose to us\n\nIn Short: We collect personal information that you provide to us.\n\nWe collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.\n\n### Personal Information Provided by You\n\nThe personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:\n\n- names\n- phone numbers\n- email addresses\n- organization name\n\n### Sensitive Information\n\nWe do not process sensitive information.\n\nAll personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.",
        },
      ],
      links: [],
    },
    {
      id: "how-do-we-process-your",
      title: "2. How do we process your information?",
      parts: [
        {
          text: "In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.\n\nWe process your personal information for a variety of reasons, depending on how you interact with our Services, including:\n\n- To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services.\n- To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.\n- To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them.\n- To save or protect an individual’s vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.",
        },
      ],
      links: [],
    },
    {
      id: "what-legal-bases-do-we",
      title: "3. What legal bases do we rely on to process your information?",
      parts: [
        {
          text: "In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfil our contractual obligations, to protect your rights, or to fulfil our legitimate business interests.\n\nIf you are located in the EU or UK, this section applies to you.\n\nThe General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:\n\n- Consent. We may process your information if you have given us permission (i.e. consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent.\n- Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:\n- Analyse how our Services are used so we can improve them to engage and retain users\n- Diagnose problems and/or prevent fraudulent activities\n- Understand how our users use our products and services so we can improve user experience\n- Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.\n- Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.\n\nIn legal terms, we are generally the ‘data controller’ under European data protection laws of the personal information described in this privacy notice, since we determine the means and/or purposes of the data processing we perform. This privacy notice does not apply to the personal information we process as a ‘data processor’ on behalf of our customers. In those situations, the customer that we provide services to and with whom we have entered into a data processing agreement is the ‘data controller’ responsible for your personal information, and we merely process your information on their behalf in accordance with your instructions. If you want to know more about our customers’ privacy practices, you should read their privacy policies and direct any questions you have to them.\n\nIf you are located in Canada, this section applies to you.\n\nWe may process your information if you have given us specific permission (i.e. express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e. implied consent). You can withdraw your consent at any time.\n\nIn some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:\n\n- If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way\n- For investigations and fraud detection and prevention\n- For business transactions provided certain conditions are met\n- If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim\n- For identifying injured, ill, or deceased persons and communicating with next of kin\n- If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse\n- If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province\n- If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records\n- If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced\n- If the collection is solely for journalistic, artistic, or literary purposes\n- If the information is publicly available and is specified by the regulations",
        },
      ],
      links: [],
    },
    {
      id: "when-and-with-whom-do",
      title: "4. When and with whom do we share your personal information?",
      parts: [
        {
          text: "In Short: We may share information in specific situations described in this section and/or with the following third parties.\n\nWe may need to share your personal information in the following situations:\n\n- Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.\n- When we use Google Analytics. We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features that we may use include: Google Analytics Demographics and Interests Reporting. To opt out of being tracked by Google Analytics across the Services, visit https://tools.google.com/dlpage/gaoptout. You can opt out of Google Analytics Advertising Features through Ads Settings and Ad Settings for mobile apps. Other opt out means include http://optout.networkadvertising.org/ and http://www.networkadvertising.org/mobile-choice. For more information on the privacy practices of Google, please visit the Google Privacy & Terms page.",
        },
      ],
      links: [
        {
          label: "https://tools.google.com/dlpage/gaoptout",
          href: "https://tools.google.com/dlpage/gaoptout",
        },
        {
          label: "Ads Settings",
          href: "https://adssettings.google.com/",
        },
        {
          label: "http://optout.networkadvertising.org/",
          href: "http://optout.networkadvertising.org/",
        },
        {
          label: "http://www.networkadvertising.org/mobile-choice",
          href: "http://www.networkadvertising.org/mobile-choice",
        },
        {
          label: "Google Privacy & Terms page",
          href: "https://policies.google.com/privacy",
        },
      ],
    },
    {
      id: "do-we-use-cookies-and",
      title: "5. Do we use cookies and other tracking technologies?",
      parts: [
        {
          text: "In Short: We may use cookies and other tracking technologies to collect and store your information.\n\nWe may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.",
        },
      ],
      links: [],
    },
    {
      id: "is-your-information-transferred-internationally",
      title: "6. Is your information transferred internationally?",
      parts: [
        {
          text: "In Short: We may transfer, store, and process your information in countries other than your own.\n\nOur servers are located in India. If you are accessing our Services from outside India, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see ‘WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?’ above), in and other countries.\n\nIf you are a resident in the European Economic Area (EEA), United Kingdom (UK), or Switzerland, then these countries may not necessarily have data protection laws or other similar laws as comprehensive as those in your country. However, we will take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law.\n\n### European Commission’s Standard Contractual Clauses\n\nWe have implemented measures to protect your personal information, including by using the European Commission’s Standard Contractual Clauses for transfers of personal information between our group companies and between us and our third-party providers. These clauses require all recipients to protect all personal information that they process originating from the EEA or UK in accordance with European data protection laws and regulations. Our Standard Contractual Clauses can be provided upon request. We have implemented similar appropriate safeguards with our third-party service providers and partners and further details can be provided upon request.",
        },
      ],
      links: [],
    },
    {
      id: "how-long-do-we-keep",
      title: "7. How long do we keep your information?",
      parts: [
        {
          text: "In Short: We keep your information for as long as necessary to fulfil the purposes outlined in this privacy notice unless otherwise required by law.\n\nWe will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).\n\nWhen we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.",
        },
      ],
      links: [],
    },
    {
      id: "how-do-we-keep-your",
      title: "8. How do we keep your information safe?",
      parts: [
        {
          text: "In Short: We aim to protect your personal information through a system of organisational and technical security measures.\n\nWe have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.",
        },
      ],
      links: [],
    },
    {
      id: "do-we-collect-information-from",
      title: "9. Do we collect information from minors?",
      parts: [
        {
          text: "In Short: We do not knowingly collect data from or market to children under 18 years of age.\n\nWe do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at hr@adamastech.in.",
        },
      ],
      links: [],
    },
    {
      id: "what-are-your-privacy-rights",
      title: "10. What are your privacy rights?",
      parts: [
        {
          text: "In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.\n\nIn some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section ‘HOW CAN YOU CONTACT US ABOUT THIS NOTICE?’ below.\n\nWe will consider and act upon any request in accordance with applicable data protection laws.\n\nIf you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority.\n\nIf you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner.\n\n### Withdrawing your consent\n\nIf we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section ‘HOW CAN YOU CONTACT US ABOUT THIS NOTICE?’ below.\n\nHowever, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.\n\n### Cookies and similar technologies\n\nMost Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.\n\nIf you have questions or comments about your privacy rights, you may email us at Info@adamastech.in.",
        },
      ],
      links: [
        {
          label: "Member State data protection authority",
          href: "https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm",
        },
        {
          label: "UK data protection authority",
          href: "https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/",
        },
        {
          label: "Federal Data Protection and Information Commissioner",
          href: "https://www.edoeb.admin.ch/edoeb/en/home.html",
        },
      ],
    },
    {
      id: "controls-for-do-not-track",
      title: "11. Controls for Do-Not-Track features",
      parts: [
        {
          text: "Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (‘DNT’) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.",
        },
      ],
      links: [],
    },
    {
      id: "do-united-states-residents-have",
      title: "12. Do United States residents have specific privacy rights?",
      parts: [
        {
          text: "In Short: If you are a resident of California, Colorado, Connecticut, Utah or Virginia, you are granted specific rights regarding access to your personal information.\n\n### What categories of personal information do we collect?\n\nWe have collected the following categories of personal information in the past twelve (12) months:",
        },
        {
          table: {
            columns: ["Category", "Examples", "Collected"],
            rows: [
              [
                "A. Identifiers",
                "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name",
                "No",
              ],
              [
                "B. Personal information as defined in the California Customer Records statute",
                "Name, contact information, education, employment, employment history, and financial information",
                "No",
              ],
              ["C. Protected classification characteristics under state or federal law", "Gender and date of birth", "No"],
              ["D. Commercial information", "Transaction information, purchase history, financial details, and payment information", "No"],
              ["E. Biometric information", "Fingerprints and voiceprints", "No"],
              [
                "F. Internet or other similar network activity",
                "Browsing history, search history, online behaviour, interest data, and interactions with our and other websites, applications, systems, and advertisements",
                "No",
              ],
              ["G. Geolocation data", "Device location", "No"],
              [
                "H. Audio, electronic, visual, thermal, olfactory, or similar information",
                "Images and audio, video or call recordings created in connection with our business activities",
                "No",
              ],
              [
                "I. Professional or employment-related information",
                "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us",
                "No",
              ],
              ["J. Education Information", "Student records and directory information", "No"],
              [
                "K. Inferences drawn from collected personal information",
                "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics",
                "No",
              ],
              ["L. Sensitive personal Information", "", "No"],
            ],
          },
        },
        {
          text: "We will use and retain the collected personal information as needed to provide the Services or for:\n\n- Category B – 6 months\n\nWe may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:\n\n- Receiving help through our customer support channels;\n- Participation in customer surveys or contests; and\n- Facilitation in the delivery of our Services and to respond to your inquiries.\n\n### How do we use and share your personal information?\n\nLearn about how we use your personal information in the section, ‘HOW DO WE PROCESS YOUR INFORMATION?’\n\n### Will your information be shared with anyone else?\n\nWe may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, ‘WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?’\n\nWe may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be ‘selling’ of your personal information.\n\nWe have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.\n\n### California Residents\n\nCalifornia Civil Code Section 1798.83, also known as the ‘Shine The Light’ law permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.\n\nIf you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g. backups, etc.).\n\n### CCPA Privacy Notice\n\nThis section applies only to California residents. Under the California Consumer Privacy Act (CCPA), you have the rights listed below.\n\nThe California Code of Regulations defines a ‘residents’ as:\n\n(1) every individual who is in the State of California for other than a temporary or transitory purpose and\n\n(2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose\n\nAll other individuals are defined as ‘non-residents’.\n\nIf this definition of ‘resident’ applies to you, we must adhere to certain rights and obligations regarding your personal information.\n\n### Your rights with respect to your personal data\n\n### Right to request deletion of the data — Request to delete\n\nYou can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.\n\n### Right to be informed — Request to know\n\nDepending on the circumstances, you have a right to know:\n\n- whether we collect and use your personal information;\n- the categories of personal information that we collect;\n- the purposes for which the collected personal information is used;\n- whether we sell or share personal information to third parties;\n- the categories of personal information that we sold, shared, or disclosed for a business purpose;\n- the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;\n- the business or commercial purpose for collecting, selling, or sharing personal information; and\n- the specific pieces of personal information we collected about you.\n\nIn accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.\n\n### Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights\n\nWe will not discriminate against you if you exercise your privacy rights.\n\n### Right to Limit Use and Disclosure of Sensitive Personal Information\n\nWe do not process consumer’s sensitive personal information.\n\n### Verification process\n\nUpon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g. phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.\n\nWe will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.\n\n### Other privacy rights\n\n- You may object to the processing of your personal information.\n- You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.\n- You can designate an authorised agent to make a request under the CCPA on your behalf. We may deny a request from an authorised agent that does not submit proof that they have been validly authorised to act on your behalf in accordance with the CCPA.\n- You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.\n\nTo exercise these rights, you can contact us by submitting a data subject access request, by email at hr@adamastech.in, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.\n\n### Colorado Residents\n\nThis section applies only to Colorado residents. Under the Colorado Privacy Act (CPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.\n\n- Right to be informed whether or not we are processing your personal data\n- Right to access your personal data\n- Right to correct inaccuracies in your personal data\n- Right to request deletion of your personal data\n- Right to obtain a copy of the personal data you previously shared with us\n- Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (‘profiling’)\n\nTo submit a request to exercise these rights described above, please email Info@adamastech.in or submit a data subject access request.\n\nIf we decline to take action regarding your request and you wish to appeal our decision, please email us at Info@adamastech.in. Within forty-five (45) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.\n\n### Connecticut Residents\n\nThis section applies only to Connecticut residents. Under the Connecticut Data Privacy Act (CTDPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.\n\n- Right to be informed whether or not we are processing your personal data\n- Right to access your personal data\n- Right to correct inaccuracies in your personal data\n- Right to request deletion of your personal data\n- Right to obtain a copy of the personal data you previously shared with us\n- Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (‘profiling’)\n\nTo submit a request to exercise these rights described above, please email Info@adamastech.in or submit a data subject access request.\n\nIf we decline to take action regarding your request and you wish to appeal our decision, please email us at Info@adamastech.in. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.\n\n### Utah Residents\n\nThis section applies only to Utah residents. Under the Utah Consumer Privacy Act (UCPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.\n\n- Right to be informed whether or not we are processing your personal data\n- Right to access your personal data\n- Right to request deletion of your personal data\n- Right to obtain a copy of the personal data you previously shared with us\n- Right to opt out of the processing of your personal data if it is used for targeted advertising or the sale of personal data\n\nTo submit a request to exercise these rights described above, please email Info@adamastech.in or submit a data subject access request.\n\n### Virginia Residents\n\nUnder the Virginia Consumer Data Protection Act (VCDPA):\n\n‘Consumer’ means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.\n\n‘Personal data’ means any information that is linked or reasonably linkable to an identified or identifiable natural person. ‘Personal data’ does not include de-identified data or publicly available information.\n\n‘Sale of personal data’ means the exchange of personal data for monetary consideration.\n\nIf this definition of ‘consumer’ applies to you, we must adhere to certain rights and obligations regarding your personal data.\n\n### Your rights with respect to your personal data\n\n- Right to be informed whether or not we are processing your personal data\n- Right to access your personal data\n- Right to correct inaccuracies in your personal data\n- Right to request deletion of your personal data\n- Right to obtain a copy of the personal data you previously shared with us\n- Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (‘profiling’)\n\n### Exercise your rights provided under the Virginia VCDPA\n\nYou may contact us by email at Info@adamastech.in or submit a data subject access request.\n\nIf you are using an authorised agent to exercise your rights, we may deny a request if the authorised agent does not submit proof that they have been validly authorised to act on your behalf.\n\n### Verification process\n\nWe may request that you provide additional information reasonably necessary to verify you and your consumer’s request. If you submit the request through an authorised agent, we may need to collect additional information to verify your identity before processing your request.\n\nUpon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.\n\n### Right to appeal\n\nIf we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at Info@adamastech.in. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may contact the Attorney General to submit a complaint.",
        },
      ],
      links: [
        {
          label: "data subject access request",
          href: "https://app.termly.io/notify/c17c8d1c-7a6b-4cd2-aa5c-ff0e40c3e4b6",
        },
        {
          label: "Attorney General to submit a complaint",
          href: "https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint",
        },
      ],
    },
    {
      id: "do-we-make-updates-to",
      title: "13. Do we make updates to this notice?",
      parts: [
        {
          text: "In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.\n\nWe may update this privacy notice from time to time. The updated version will be indicated by an updated ‘Revised’ date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.",
        },
      ],
      links: [],
    },
    {
      id: "how-can-you-contact-us",
      title: "14. How can you contact us about this notice?",
      parts: [
        {
          text: "If you have questions or comments about this notice, you may email us at hr@adamastech.in or contact us by post at:\n\nAdamas Tech Consulting\n2nd Floor, Vallabha Pamadi, 2727,\n16th Cross, 27th Main Rd, HSR layout\nBengaluru, Karnataka 560068\nIndia\n\nIf you are a resident in the United Kingdom, we are the ‘data controller’ of your personal information. We have appointed Arun Bardhan to be our representative in the UK. You can contact them directly regarding our processing of your information, by email at arun.bardhan@adamastech.co.uk, or by post to:\n\n39 Roxborough Road\nHarrow, London HA1 1NS\nEngland",
        },
      ],
      links: [],
    },
    {
      id: "how-can-you-review-update",
      title: "15. How can you review, update, or delete the data we collect from you?",
      parts: [
        {
          text: "Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.",
        },
      ],
      links: [
        {
          label: "data subject access request",
          href: "https://app.termly.io/notify/c17c8d1c-7a6b-4cd2-aa5c-ff0e40c3e4b6",
        },
      ],
    },
  ],
  intro:
    "This privacy notice for Adamas Tech Consulting (doing business as Adamas Tech) (‘we’, ‘us’, or ‘our’), describes how and why we might collect, store, use, and/or share (‘process’) your information when you use our services (‘Services’), such as when you:\n\n- Visit our website at https://adamastech.in, or any website of ours that links to this privacy notice\n- Engage with us in other related ways, including any sales, marketing, or events\n\n### Questions or concerns?\n\nReading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at Info@adamastech.in.",
} satisfies LegalDoc;

// Converted from docs/source-content/terms-of-use.md.
const terms = {
  updated: "February 15, 2024",
  sections: [
    {
      id: "agreement-to-our-legal-terms",
      title: "Agreement to our legal terms",
      parts: [
        {
          text: "We are Adamas Tech Consulting Private Limited, doing business as Adamas Tech (‘Company’, ‘we’, ‘us’, or ‘our’), a company registered in India at 2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068.\n\nWe operate the website https://adamastech.in (the ‘Site’), as well as any other related products and services that refer or link to these legal terms (the ‘Legal Terms’) (collectively, the ‘Services’).\n\nWe provide services in the areas Artificial Intelligence, Machine Learning and Data Science. We also offer clients with technology solutions to create applications using different technologies. Our Designers, Architects and developers work closely with the clients to provide solutions across different technologies including Migration to the Cloud.\n\nYou can contact us by phone at 6296680677, email at Info@adamastech.in, or by mail to 2nd Floor, Vallabha Pamadi, 2727, 16th Cross, 27th Main Rd, HSR Layout, Bengaluru, Karnataka 560068, India.\n\nThese Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (‘you’), and Adamas Tech Consulting Private Limited, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.\n\nSupplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the ‘Last updated’ date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.\n\nThe Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.\n\nWe recommend that you print a copy of these Legal Terms for your records.",
        },
      ],
      links: [],
    },
    {
      id: "our-services",
      title: "1. Our services",
      parts: [
        {
          text: "The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.\n\nThe Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).",
        },
      ],
      links: [],
    },
    {
      id: "intellectual-property-rights",
      title: "2. Intellectual property rights",
      parts: [
        {
          text: "### Our intellectual property\n\nWe are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the ‘Content’), as well as the trademarks, service marks, and logos contained therein (the ‘Marks’).\n\nOur Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.\n\nThe Content and Marks are provided in or through the Services ‘AS IS’ for your personal, non-commercial use or internal business purpose only.\n\n### Your use of our Services\n\nSubject to your compliance with these Legal Terms, including the ‘PROHIBITED ACTIVITIES’ section below, we grant you a non-exclusive, non-transferable, revocable licence to:\n\n- access the Services; and\n- download or print a copy of any portion of the Content to which you have properly gained access.\n\nsolely for your personal, non-commercial use or internal business purpose.\n\nExcept as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.\n\nIf you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: Info@adamastech.in. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.\n\nWe reserve all rights not expressly granted to you in and to the Services, Content, and Marks.\n\nAny breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.\n\n### Your submissions\n\nPlease review this section and the ‘PROHIBITED ACTIVITIES’ section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.\n\nSubmissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services (‘Submissions’), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.\n\nYou are responsible for what you post or upload: By sending us Submissions through any part of the Services you:\n\n- confirm that you have read and agree with our ‘PROHIBITED ACTIVITIES’ and will not post, send, publish, upload, or transmit through the Services any Submission that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;\n- to the extent permissible by applicable law, waive any and all moral rights to any such Submission;\n- warrant that any such Submission are original to you or that you have the necessary rights and licences to submit such Submissions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions; and\n- warrant and represent that your Submissions do not constitute confidential information.\n\nYou are solely responsible for your Submissions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party’s intellectual property rights, or (c) applicable law.",
        },
      ],
      links: [],
    },
    {
      id: "user-representations",
      title: "3. User representations",
      parts: [
        {
          text: "By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorised purpose; and (5) your use of the Services will not violate any applicable law or regulation.\n\nIf you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).",
        },
      ],
      links: [],
    },
    {
      id: "prohibited-activities",
      title: "4. Prohibited activities",
      parts: [
        {
          text: "You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.\n\nAs a user of the Services, you agree not to:\n\n- Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.\n- Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.\n- Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.\n- Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.\n- Use any information obtained from the Services in order to harass, abuse, or harm another person.\n- Make improper use of our support services or submit false reports of abuse or misconduct.\n- Use the Services in a manner inconsistent with any applicable laws or regulations.\n- Engage in unauthorised framing of or linking to the Services.\n- Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.\n- Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.\n- Delete the copyright or other proprietary rights notice from any Content.\n- Attempt to impersonate another user or person or use the username of another user.\n- Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (‘gifs’), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as ‘spyware’ or ‘passive collection mechanisms’ or ‘pcms’).\n- Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.\n- Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.\n- Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.\n- Copy or adapt the Services’ software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.\n- Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.\n- Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorised script or other software.\n- Use a buying agent or purchasing agent to make purchases on the Services.\n- Make any unauthorised use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.\n- Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavour or commercial enterprise.",
        },
      ],
      links: [],
    },
    {
      id: "user-generated-contributions",
      title: "5. User generated contributions",
      parts: [
        {
          text: "The Services does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, ‘Contributions’). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated in accordance with the Services’ Privacy Policy. When you create or make available any Contributions, you thereby represent and warrant that:\n\n- The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.\n- You are the creator and owner of or have the necessary licences, rights, consents, releases, and permissions to use and to authorise us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.\n- You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.\n- Your Contributions are not false, inaccurate, or misleading.\n- Your Contributions are not unsolicited or unauthorised advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.\n- Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libellous, slanderous, or otherwise objectionable (as determined by us).\n- Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.\n- Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.\n- Your Contributions do not violate any applicable law, regulation, or rule.\n- Your Contributions do not violate the privacy or publicity rights of any third party.\n- Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.\n- Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.\n- Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.\n\nAny use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.",
        },
      ],
      links: [],
    },
    {
      id: "contribution-licence",
      title: "6. Contribution licence",
      parts: [
        {
          text: "You and Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).\n\nBy submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.\n\nWe do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.",
        },
      ],
      links: [],
    },
    {
      id: "third-party-websites-and-content",
      title: "7. Third-party websites and content",
      parts: [
        {
          text: "The Services may contain (or you may be sent via the Site) links to other websites (‘Third-Party Websites’) as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties (‘Third-Party Content’). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.",
        },
      ],
      links: [],
    },
    {
      id: "services-management",
      title: "8. Services management",
      parts: [
        {
          text: "We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.",
        },
      ],
      links: [],
    },
    {
      id: "privacy-policy",
      title: "9. Privacy policy",
      parts: [
        {
          text: "We care about data privacy and security. Please review our Privacy Policy: https://adamastech.in/privacy/. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.",
        },
      ],
      links: [
        {
          label: "https://adamastech.in/privacy/",
          href: "https://adamastech.in/privacy/",
        },
      ],
    },
    {
      id: "term-and-termination",
      title: "10. Term and termination",
      parts: [
        {
          text: "These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.\n\nIf we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.",
        },
      ],
      links: [],
    },
    {
      id: "modifications-and-interruptions",
      title: "11. Modifications and interruptions",
      parts: [
        {
          text: "We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.\n\nWe cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.",
        },
      ],
      links: [],
    },
    {
      id: "governing-law",
      title: "12. Governing law",
      parts: [
        {
          text: "These Legal Terms shall be governed by and defined following the laws of India. Adamas Tech Consulting Private Limited and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.",
        },
      ],
      links: [],
    },
    {
      id: "dispute-resolution",
      title: "13. Dispute resolution",
      parts: [
        {
          text: "You agree to irrevocably submit all disputes related to these Legal Terms or the legal relationship established by these Legal Terms to the jurisdiction of the India courts. Adamas Tech Consulting Private Limited shall also maintain the right to bring proceedings as to the substance of the matter in the courts of the country where you reside or, if these Legal Terms are entered into in the course of your trade or profession, the state of your principal place of business.",
        },
      ],
      links: [],
    },
    {
      id: "corrections",
      title: "14. Corrections",
      parts: [
        {
          text: "There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.",
        },
      ],
      links: [],
    },
    {
      id: "disclaimer",
      title: "15. Disclaimer",
      parts: [
        {
          text: "THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES’ CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORISED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGEMENT AND EXERCISE CAUTION WHERE APPROPRIATE.",
        },
      ],
      links: [],
    },
    {
      id: "limitations-of-liability",
      title: "16. Limitations of liability",
      parts: [
        {
          text: "IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.",
        },
      ],
      links: [],
    },
    {
      id: "indemnification",
      title: "17. Indemnification",
      parts: [
        {
          text: "You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defence and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defence of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.",
        },
      ],
      links: [],
    },
    {
      id: "user-data",
      title: "18. User data",
      parts: [
        {
          text: "We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.",
        },
      ],
      links: [],
    },
    {
      id: "electronic-communications-transactions-and-signatures",
      title: "19. Electronic communications, transactions, and signatures",
      parts: [
        {
          text: "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.",
        },
      ],
      links: [],
    },
    {
      id: "california-users-and-residents",
      title: "20. California users and residents",
      parts: [
        {
          text: "If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.",
        },
      ],
      links: [],
    },
    {
      id: "miscellaneous",
      title: "21. Miscellaneous",
      parts: [
        {
          text: "These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defences you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.",
        },
      ],
      links: [],
    },
    {
      id: "contact-us",
      title: "22. Contact us",
      parts: [
        {
          text: "In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:\n\nAdamas Tech Consulting Private Limited\n2nd Floor, Vallabha Pamadi, 2727\n16th Cross, 27th Main Rd, HSR Layout\nBengaluru, Karnataka 560068\nIndia\nPhone: 6296680677\ninfo@adamastech.in",
        },
      ],
      links: [],
    },
  ],
} satisfies LegalDoc;

// The privacy notice refers to a "Cookie Notice"; link it to the new page.
privacy.sections.find((s) => s.id === "do-we-use-cookies-and-other")?.links.push({ label: "Cookie Policy", href: "/cookie-policy" });
// The live terms link to https://adamastech.in/privacy/ (a different domain); point readers at this site's policy.
const termsPrivacy = terms.sections.find((s) => s.id === "privacy-policy");
if (termsPrivacy) termsPrivacy.links = [{ label: "Privacy Policy", href: "/privacy-policy" }];

// ── Pages ────────────────────────────────────────────────────────────────

export const pages: PageSeed[] = [
  {
    path: "/about",
    template: "about",
    eyebrow: "About Us",
    title: "Innovative Solutions for a Better Tomorrow",
    intro: "Delivering unique and modern technology and creative solutions to help businesses thrive and achieve lasting success.",
    blocks: {
      story: {
        eyebrow: "Our Company",
        heading: "Mission & Journey",
        ctaLabel: "Contact Us",
        ctaHref: "/contact",
        paragraphs: [
          "As an ISO 9001 and ISO 27001 certified company and a CMMI Level 3 certification holder, we are dedicated to delivering high-quality, secure, and innovative technology solutions.",
        ],
        // Visible on the live page but held back here: each sentence carries an unverified or conflicting figure.
        held: [
          {
            text: "Founded in 2021, Adamas Tech Consulting has rapidly expanded its presence across four countries: Saudi Arabia, England, the USA, and India.",
            reason:
              "CONFLICT: founding year (2021 vs hidden 1995+ / 22+ years) and 'four countries' (omits the UAE / Dubai office). Stats founded-2021, established-1995.",
          },
          {
            text: "With a team of over 100 experts, we blend deep industry knowledge with cutting-edge technology to provide tailored solutions that help businesses thrive in a digital world.",
            reason: "Unverified: team size ('over 100 experts', stat team-size-100).",
          },
        ],
        pendingLabel: "Founding story and team size to be confirmed",
      },
      mission: {
        eyebrow: "Our mission",
        text: "Our mission is to empower organisations by harnessing technology to optimise processes, enhancing efficiency and driving digital transformation to realise untapped potential.",
      },
      group: {
        eyebrow: "RICE Adamas Group",
        body: "[Placeholder] RICE Adamas Group description.",
      },
      whyUs: {
        eyebrow: "Why Choose Us",
        heading: "Your Trusted Partner in Technology Innovation",
        body: "We deliver custom solutions that are tailored to your unique needs, ensuring efficiency and scalability.",
        items: [
          { title: "Tailored Solutions", body: "We create custom solutions that perfectly fit your business needs and goals." },
          { title: "Expert Team", body: "Our experienced team excels in leveraging cutting-edge technologies for your success" },
          { title: "End-to-End Services", body: "We manage every phase, from planning to deployment and ongoing support." },
          { title: "Innovative Approach", body: "We use the latest technology trends to drive your digital transformation journey" },
          { title: "Agile Methodology", body: "We adapt quickly to changes, ensuring your project is delivered on time" },
          { title: "Customer-Centric", body: "We prioritize your needs, building long-term partnerships with exceptional service." },
        ],
      },
      model: {
        eyebrow: "Our Model",
        heading: "How we do",
        body: "Save time and money with our powerful method.",
        steps: [
          "Discovery and Vision Setting",
          "Comprehensive Planning",
          "Design and Prototyping",
          "Agile Development",
          "Quality Assurance",
          "Deployment and Support",
        ],
      },
      leadership: { eyebrow: "Leadership", heading: "Our Company Leading Members", ctaLabel: "Meet the team", ctaHref: "/about/team" },
      credentials: {
        eyebrow: "Partners & Certifications",
        heading: "Trusted Partners & Certified Excellence",
        body: "Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.",
        ctaLabel: "View our credentials",
        ctaHref: "/credentials",
      },
    },
    seoTitle: "About Us",
    seoDescription: "Delivering unique and modern technology and creative solutions to help businesses thrive and achieve lasting success.",
    status: "PUBLISHED",
    sortOrder: 0,
    needsReview: true,
    editorNote:
      "Source: about-us.md (visible sections only). HELD BACK: 'Founded in 2021 … four countries' and 'With a team of over 100 experts …' (conflicting / unverified figures; restore from blocks.story.held once confirmed). MISSING: RICE Adamas Group description (sitemap). REVIEW: heading 'How we do' kept verbatim (suggest 'How we work'). Eyebrows stored in title case (live CSS capitalises). SEO description drafted from the hero line.",
  },
  {
    path: "/about/team",
    template: "team",
    eyebrow: "Leadership",
    title: "Our Company Leading Members",
    blocks: {
      bioPendingLabel: "Biography to be confirmed",
      emptyLabel: "Leadership profiles to be confirmed",
    },
    seoTitle: "Leadership team",
    seoDescription: "The leadership of Adamas Tech Consulting.",
    status: "PUBLISHED",
    sortOrder: 1,
    needsReview: true,
    editorNote:
      "Source: about-us.md LEADERSHIP section (names and roles in content/people.ts). MISSING: page introduction, bios, LinkedIn URLs, DECISION Q5.7 who is listed. SEO description drafted (interim).",
  },
  {
    path: "/about/careers",
    template: "coming-soon",
    eyebrow: "About Us",
    title: "Careers",
    blocks: {
      status: "Coming soon",
      message: "Our careers page is on its way. In the meantime, we would be glad to hear from you.",
      links: [
        { label: "Contact us", href: "/contact" },
        { label: "About AdamasTech", href: "/about" },
        { label: "Meet our leadership", href: "/about/team" },
      ],
    },
    seoTitle: "Careers",
    noindex: true,
    status: "PUBLISHED",
    sortOrder: 2,
    needsReview: true,
    editorNote:
      "Phase 2 (Q2.9, Q13.1). No careers content on the live site. INTERIM MICROCOPY: the 'coming soon' message is UI copy for sign-off. noindex until live.",
  },
  {
    path: "/credentials",
    template: "credentials",
    eyebrow: "Partners & Certifications",
    title: "Trusted Partners & Certified Excellence",
    intro:
      "Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.",
    blocks: {
      certifications: {
        eyebrow: "Certifications",
        heading: "Certified Quality",
        body: "ISO 9001, ISO 27001 certified, and CMMI Level 3, ensuring top standards of quality, security, and compliance.",
      },
      partners: {
        eyebrow: "Partners",
        heading: "Partner programmes",
      },
      pending: {
        certificate: "Certificate to be supplied",
        number: "To be confirmed",
        validity: "To be confirmed",
        tier: "Programme and tier to be confirmed",
      },
    },
    seoTitle: "Credentials: certifications and partners",
    seoDescription:
      "Adamas Tech Consulting collaborates with industry-leading partners and holds key certifications, ensuring top-tier solutions and expertise for every project.",
    status: "PUBLISHED",
    sortOrder: 3,
    needsReview: true,
    editorNote:
      "Copy from in.md ('PARTNERS & CERTIFICATIONS' header) and the homepage 'Certified Quality' item. Certifications come from the Certification table (content/trust.ts): none verified, so no certificate number, validity or PDF is shown (Q5.9). 'Partner programmes' is a UI label.",
  },
  {
    path: "/contact",
    template: "contact",
    eyebrow: "Contact Us",
    title: "We are always open to talk",
    intro: "We have offices and teams all around the world",
    blocks: {
      form: {
        eyebrow: "Contact",
        heading: "Let’s get in touch",
        body: "You can reach us anytime via marketing@adamastech.in",
        email: "marketing@adamastech.in",
      },
      support: { heading: "Support", body: "Contact our fast support team", email: "marketing@adamastech.in" },
      phone: { heading: "Phone", body: "Mon-Fri from 9:30am to 6:30pm.", number: "+91-6296680677", href: "tel:+916296680677" },
      presence: { eyebrow: "Our Presence", heading: "Explore our global presence around the world" },
    },
    seoTitle: "Contact us",
    seoDescription: "We are always open to talk. We have offices and teams all around the world.",
    status: "PUBLISHED",
    sortOrder: 4,
    needsReview: true,
    editorNote:
      "Source: contact.md. TYPO FIXED: 'Lets get in touch' → 'Let’s get in touch'. Not migrated: the Locations intro 'Our location is strategically situated at the heart of City…' (theme filler) and the second office list (Harrow, Riyadh, Bhubaneswar: draft offices, D5). The office hours belong to the India number: confirm hours per region.",
  },
  {
    path: "/thank-you",
    template: "thank-you",
    eyebrow: "Message sent",
    title: "Thank you for getting in touch",
    intro: "Your message has reached our team.",
    blocks: {
      nextHeading: "While you wait",
      next: [
        { title: "Explore our services", href: "/services", icon: "layers" },
        { title: "Read our success stories", href: "/case-studies", icon: "chart" },
        { title: "Our credentials", href: "/credentials", icon: "award" },
      ],
    },
    seoTitle: "Thank you",
    noindex: true,
    status: "PUBLISHED",
    sortOrder: 5,
    needsReview: true,
    editorNote:
      "INTERIM MICROCOPY (no live equivalent): confirmation title, line and next steps are UI copy for sign-off. No response time is promised (response-time stats are unverified).",
  },
  {
    path: "/privacy-policy",
    template: "legal",
    eyebrow: "Legal",
    title: "Privacy Policy",
    blocks: { updated: privacy.updated, intro: privacy.intro, sections: privacy.sections },
    seoTitle: "Privacy Policy",
    seoDescription: "How Adamas Tech Consulting collects, stores, uses and shares your information.",
    status: "PUBLISHED",
    sortOrder: 6,
    needsReview: true,
    editorNote: `${LEGAL_NOTE} The live notice refers to the website https://adamastech.in.`,
  },
  {
    path: "/terms-of-use",
    template: "legal",
    eyebrow: "Legal",
    title: "Terms of Use",
    blocks: { updated: terms.updated, documentTitle: "Terms of Service", sections: terms.sections },
    seoTitle: "Terms of Use",
    seoDescription: "The legal terms that govern your use of the Adamas Tech Consulting website and services.",
    status: "PUBLISHED",
    sortOrder: 7,
    needsReview: true,
    editorNote: `${LEGAL_NOTE} TYPO FIXED: 'Private Limited ,' → 'Private Limited,'; 'CONTRIBUTIONLICENCE' → 'Contribution licence'. Section numbers added (the live table of contents is an ordered list). The live document is titled 'TERMS OF SERVICE'; the page keeps the live page title 'Terms of use'.`,
  },
  {
    path: "/cookie-policy",
    template: "legal",
    eyebrow: "Legal",
    title: "Cookie Policy",
    blocks: {
      sections: [],
      pending: "[Placeholder] Cookie policy text.",
    },
    seoTitle: "Cookie Policy",
    noindex: true,
    status: "PUBLISHED",
    sortOrder: 8,
    needsReview: true,
    editorNote:
      "MISSING (Q10.2–Q10.4): no cookie policy on the live site. The privacy notice refers to a 'Cookie Notice'. Designed placeholder until the client supplies the text; noindex until then.",
  },
];
