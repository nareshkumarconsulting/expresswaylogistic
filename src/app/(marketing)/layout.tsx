import { HelpLauncher } from "@/components/organisms/help-launcher";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { JsonLd } from "@/components/molecules/json-ld";
import { organizationSchema } from "@/lib/schema";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <HelpLauncher />
    </>
  );
}
