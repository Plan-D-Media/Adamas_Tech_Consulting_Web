import { LegalPage, legalMetadata } from "@/components/company/LegalPage";

const PATH = "/cookie-policy";

export function generateMetadata() {
  return legalMetadata(PATH);
}

export default function CookiePolicyPage() {
  return <LegalPage path={PATH} />;
}
