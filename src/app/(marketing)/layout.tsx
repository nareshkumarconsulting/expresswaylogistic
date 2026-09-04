import { HelpLauncher } from "@/components/organisms/help-launcher";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { JsonLd } from "@/components/molecules/json-ld";
import { organizationSchema, personSchema, websiteSchema } from "@/lib/schema";

export const revalidate = 3600;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), ...personSchema()]} />
      <SiteHeader />
      <main id="main-content" className="flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
      <HelpLauncher />
    </>
  );
}
