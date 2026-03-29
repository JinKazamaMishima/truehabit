import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/actions/clients";
import { NewClientFormSelects } from "./_components/new-client-form-selects";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function NewClientPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);
  const nc = d.admin.clients.newClient;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{nc.title}</h1>
        <p className="text-muted-foreground">
          {nc.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{nc.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClient} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{nc.fullName}</Label>
                <Input id="name" name="name" required placeholder={nc.fullNamePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{nc.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={nc.emailPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{nc.phone}</Label>
                <Input id="phone" name="phone" placeholder={nc.phonePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{nc.dateOfBirth}</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>
              <NewClientFormSelects />
              <div className="space-y-2">
                <Label htmlFor="activityLevel">{nc.activityLevel}</Label>
                <Input
                  id="activityLevel"
                  name="activityLevel"
                  placeholder={nc.activityLevelPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport">{nc.sport}</Label>
                <Input
                  id="sport"
                  name="sport"
                  placeholder={nc.sportPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{nc.notes}</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder={nc.notesPlaceholder}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">{nc.createButton}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
