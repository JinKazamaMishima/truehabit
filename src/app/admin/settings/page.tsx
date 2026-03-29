import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSettingsBySection } from "@/actions/settings";
import { getTestimonials } from "@/actions/testimonials";
import { getUsers, getUnlinkedClients } from "@/actions/users";
import { BusinessInfoForm } from "./_components/business-info-form";
import { HeroForm } from "./_components/hero-form";
import { AboutForm } from "./_components/about-form";
import { TestimonialsManager } from "./_components/testimonials-manager";
import { UserManagement } from "./_components/user-management";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function SettingsPage() {
  const [
    businessSettings,
    heroSettings,
    aboutSettings,
    testimonialsList,
    usersList,
    unlinkedClients,
  ] = await Promise.all([
    getSettingsBySection("business"),
    getSettingsBySection("hero"),
    getSettingsBySection("about"),
    getTestimonials(),
    getUsers(),
    getUnlinkedClients(),
  ]);

  const locale = await getLocale();
  const d = await getDictionary(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.settings.title}</h1>
        <p className="text-muted-foreground">
          {d.admin.settings.subtitle}
        </p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">{d.admin.settings.tabs.businessInfo}</TabsTrigger>
          <TabsTrigger value="hero">{d.admin.settings.tabs.heroBanner}</TabsTrigger>
          <TabsTrigger value="about">{d.admin.settings.tabs.aboutBio}</TabsTrigger>
          <TabsTrigger value="testimonials">{d.admin.settings.tabs.testimonials}</TabsTrigger>
          <TabsTrigger value="users">{d.admin.settings.tabs.users}</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6">
          <BusinessInfoForm initialValues={businessSettings} />
        </TabsContent>

        <TabsContent value="hero" className="mt-6">
          <HeroForm initialValues={heroSettings} />
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <AboutForm initialValues={aboutSettings} />
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <TestimonialsManager initialTestimonials={testimonialsList} />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement
            initialUsers={usersList}
            initialUnlinkedClients={unlinkedClients}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
