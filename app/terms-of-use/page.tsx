import { LegalPage, legalMetadata } from "@/components/company/LegalPage";

const PATH = "/terms-of-use";

export function generateMetadata() {
  return legalMetadata(PATH);
}

export default function TermsOfUsePage() {
  return <LegalPage path={PATH} />;
}
