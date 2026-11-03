import { LegalPage, legalMetadata } from "@/components/company/LegalPage";

const PATH = "/privacy-policy";

export function generateMetadata() {
  return legalMetadata(PATH);
}

export default function PrivacyPolicyPage() {
  return <LegalPage path={PATH} />;
}
