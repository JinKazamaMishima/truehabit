import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSettingsBySection } from "@/actions/settings";
import { getTestimonials } from "@/actions/testimonials";
import { getUsers, getUnlinkedClients } from "@/actions/users";
import { BusinessInfoForm } from "./_components/business-info-form";
import { HeroForm } from "./_components/hero-form";
import { AboutForm } from "./_components/about-form";
import { TestimonialsManager } from "./_components/testimonials-manager";
import { UserManagement } from "./_components/user-management";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your public site content, business information, and users.
        </p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="hero">Hero Banner</TabsTrigger>
          <TabsTrigger value="about">About / Bio</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
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
