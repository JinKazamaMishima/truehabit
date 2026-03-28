import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getSiteSettingsBySection } from "@/lib/db/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const business = await getSiteSettingsBySection("business");

  return (
    <>
      <Navbar businessName={business.business_name || undefined} />
      <main className="flex-1">{children}</main>
      <Footer
        phone={business.business_phone || undefined}
        email={business.business_email || undefined}
        address={business.business_address || undefined}
        instagramUrl={business.business_instagram || undefined}
        facebookUrl={business.business_facebook || undefined}
        whatsappNumber={business.business_whatsapp || undefined}
        tagline={business.business_tagline || undefined}
      />
    </>
  );
}
